import 'dart:convert';
import 'dart:io';
import 'package:app/screens/form/SelectedFormsPage.dart';
import 'package:app/utils/FormFields/DropDown.dart';
import 'package:app/utils/FormFields/Heading.dart';
import 'package:app/utils/FormFields/MultipleChoice.dart';
import 'package:app/utils/FormFields/NormalDropDown.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:path/path.dart';
import 'package:async/async.dart';
import '../../utils/FormFields/Address.dart';
import '../../utils/FormFields/Appointment.dart';
import '../../utils/FormFields/Email.dart';
import '../../utils/FormFields/FullName.dart';
import '../../utils/FormFields/Image.dart';
import '../../utils/FormFields/LongText.dart';
import '../../utils/FormFields/Number.dart';

class FormService {
  static const String baseUrl =
      'https://sand-backend.onrender.com/api/v1/promoter/fetchFormField';

  static Future<FormDetails> fetchFormDetails(String formId) async {
    try {
      final url = Uri.parse(baseUrl);
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'formId': formId}),
      );

      if (response.statusCode == 200) {
        var jsonResponse =
            jsonDecode(response.body) as Map<String, dynamic>; // Explicit cast
        return FormDetails.fromJson(
            jsonResponse['data'][0] as Map<String, dynamic>);
      } else {
        throw Exception(
            'Failed to fetch form details. Status code: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to fetch form details. Error: $e');
    }
  }

  static Future<String> fetchCollectionName(String formId) async {
    try {
      final url = Uri.parse(baseUrl);
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'formId': formId}),
      );

      if (response.statusCode == 200) {
        var jsonResponse =
            jsonDecode(response.body) as Map<String, dynamic>; // Explicit cast
        return (jsonResponse['data'][0]
            as Map<String, dynamic>)['collectionName'] as String;
      } else {
        throw Exception(
            'Failed to fetch collection name. Status code: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to fetch collection name. Error: $e');
    }
  }

  static Future<void> submitFormData(
      String collectionName, Map<String, dynamic> data) async {
    final url = Uri.parse(
        'https://sand-backend.onrender.com/api/v1/promoter/fillFormData/$collectionName');

    var request = http.MultipartRequest('POST', url);

    try {
      for (var entry in data.entries) {
        var key = entry.key;
        var value = entry.value;

        // Handle dropdown field formatting
        if (value is Map<String, dynamic> && value.containsKey("type")) {
          if (value["type"] == "NormalDropDown") {
            key = value["title"]; // Keep the title as the key
            value = value["selectedValue"]; // Use only the selected value
          }
        }

        if (value is Map<String, dynamic> &&
            value["type"] == "Multiple Choice") {
          key = value["title"]; // Use the title as the key
          value = value["selectedChoices"]; // Extract only selected choices
        }

        if (value is File) {
          var stream =
              http.ByteStream(DelegatingStream.typed(value.openRead()));
          var length = await value.length();
          var multipartFile = http.MultipartFile(key, stream, length,
              filename: basename(value.path));
          request.files.add(multipartFile);
        } else {
          request.fields[key] = value.toString();
        }
      }

      var response = await request.send();

      if (response.statusCode == 200) {
        print('Data saved successfully');
      } else {
        throw Exception(
            'Failed to save data. Status code: ${response.statusCode}');
      }
    } catch (e) {
      print('Error saving data: $e');
      throw Exception('Failed to save data. Error: $e');
    }
  }

  // Added attendance check function
  static Future<bool> checkPunchInStatus(String promoterId) async {
    final url = Uri.parse(
        'https://sand-backend.onrender.com/api/v1/promoter/checkPunchIn');
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'promoterId': promoterId}),
      );
      if (response.statusCode == 200) {
        var jsonResponse = jsonDecode(response.body);
        return jsonResponse['data']['isPunchedIn'];
      } else {
        throw Exception('Failed to check punch-in status');
      }
    } catch (e) {
      print('Error: $e');
      return false;
    }
  }
}

class FormDetails {
  final String campaignId;
  final List<Map<String, dynamic>> formFields;
  final String collectionName;

  FormDetails({
    required this.campaignId,
    required this.formFields,
    required this.collectionName,
  });

  factory FormDetails.fromJson(Map<String, dynamic> json) {
    return FormDetails(
      campaignId: json['campaignId'],
      formFields: (json['formFields'] as List)
          .map((field) => {
                'type': field['type'],
                'title': field['title'],
                'uniqueId': field['uniqueId'],
                'options': field['options'] != null ? field['options'] : null,
              })
          .toList(),
      collectionName: json['collectionName'],
    );
  }
}

class FormDetailsPage extends StatefulWidget {
  final String formId;
  final String promoterId;
  final String formTitle;

  const FormDetailsPage({
    Key? key,
    required this.formId,
    required this.promoterId,
    required this.formTitle,
  }) : super(key: key);

  @override
  State<FormDetailsPage> createState() => _FormDetailsPageState();
}

class _FormDetailsPageState extends State<FormDetailsPage> {
  late Future<FormDetails> _formDetailsFuture;
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final Map<String, dynamic> _formData = {};
  bool _isSubmitting = false;
  bool _isImageUploaded = false;
  bool _isPunchedIn = false; // Added attendance flag

  bool _isSubmitEnabled() {
    // Original logic: enable submit if at least one field is filled or an image is uploaded.
    bool hasFilledField = _formData.isNotEmpty;
    return hasFilledField || _isImageUploaded;
  }

  void _handleImageChange(String fieldTitle, File? imageFile) {
    if (imageFile != null) {
      setState(() {
        _formData[fieldTitle] = imageFile;
        _isImageUploaded = true;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _formDetailsFuture = FormService.fetchFormDetails(widget.formId);
    _checkPunchInStatus(); // Check attendance on init
  }

  Future<void> _checkPunchInStatus() async {
    bool status = await FormService.checkPunchInStatus(widget.promoterId);
    setState(() {
      _isPunchedIn = status;
    });
  }

  Widget _buildFormField(Map<String, dynamic> field) {
    String fieldType = field['type'] ?? '';
    String fieldTitle = field['title'] ?? '';
    dynamic options = field['options'];

    switch (fieldType) {
      case 'Address':
        return Address(
          addressTitle: fieldTitle,
          initialValue: _formData["Address"],
          onChangedAddress: (value) {
            setState(() {
              _formData['Office/Building Name'] = value;
            });
          },
          onChangedStreetAddress: (value) {
            setState(() {
              _formData['Street Address'] = value;
            });
          },
          onChangedStreetAddressLine2: (value) {
            setState(() {
              _formData['Street Address Line 2'] = value;
            });
          },
          onChangedCity: (value) {
            setState(() {
              _formData["City"] = value;
            });
          },
          onChangedState: (value) {
            setState(() {
              _formData['State'] = value;
            });
          },
          onChangedPincode: (value) {
            setState(() {
              _formData['Pincode'] = value;
            });
          },
        );
      case 'Multiple Choice':
        return MultipleChoiceField(
          multipleChoiceFieldTitle: fieldTitle,
          initialValue: (_formData[fieldTitle] is Map<String, dynamic>)
              ? (_formData[fieldTitle]['selectedChoices'] as List<String>?)
              : null,
          onChanged: (value) {
            setState(() {
              _formData[fieldTitle] = value;
            });
          },
        );
      case 'Date Picker':
        return Appointment(
          appointmentTitle: fieldTitle,
          initialValue: _formData[fieldTitle],
          onChanged: (value) {
            setState(() {
              _formData[fieldTitle] = value;
            });
          },
        );
      case 'Heading':
        return Heading(
          headingTitle: fieldTitle,
          initialValue: _formData[fieldTitle],
          onChanged: (value) {
            setState(() {
              _formData[fieldTitle] = value;
            });
          },
        );
      case 'Email':
        return Email(
          initialValue: _formData[fieldTitle],
          onChanged: (value) {
            setState(() {
              _formData[fieldTitle] = value;
            });
          },
          emailTitle: fieldTitle,
        );
      case 'Full Name':
        return FullName(
          initialFirstName: _formData["$fieldTitle 1"],
          initialLastName: _formData[fieldTitle + " " + '2'],
          onChangedFirstName: (value) {
            setState(() {
              _formData["$fieldTitle (First Name)"] = value;
            });
          },
          onChangedLastName: (value) {
            setState(() {
              _formData[fieldTitle + " " + '(Last Name)'] = value;
            });
          },
          fullNameTitle: fieldTitle,
        );
      case 'Image':
        return ImagePickerWidget(
          imageTitle: fieldTitle,
          onChanged: (String title, File? file) {
            _handleImageChange(fieldTitle, file);
          },
        );
      case 'Long Text':
        return LongText(
          longTextTitle: fieldTitle,
          initialValue: _formData[fieldTitle],
          onChanged: (value) {
            setState(() {
              _formData[fieldTitle] = value;
            });
          },
        );
      case 'Number':
        return Number(
          initialValue: _formData[fieldTitle],
          onChanged: (value) {
            setState(() {
              _formData[fieldTitle] = value;
            });
          },
          numberTitle: fieldTitle,
        );
      case 'Drop Down':
        return DropDownField(
          title: fieldTitle,
          options: field['options'][0],
          onChanged: (value) {
            setState(() {
              _formData[fieldTitle] = value;
            });
          },
        );
      case 'NormalDropDown':
        return NormalDropDownField(
          initialValue: _formData[fieldTitle],
          onChanged: (value) {
            setState(() {
              _formData[fieldTitle] = value;
            });
          },
          dropDownFieldTitle: fieldTitle,
        );
      default:
        return SizedBox.shrink();
    }
  }

  Future<String> _submitForm() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      setState(() {
        _isSubmitting = true;
      });
      print('Form Data: $_formData');

      try {
        String collectionName =
            await FormService.fetchCollectionName(widget.formId);
        await FormService.submitFormData(collectionName, _formData);
        print('Form submitted successfully!');
        setState(() {
          _formData.clear();
          _isSubmitting = false;
          _isImageUploaded = false;
        });
        return "Form Submitted Successfully!";
      } catch (e) {
        print('Error submitting form: $e');
        setState(() {
          _isSubmitting = false;
        });
        return "Error in submitting form";
      }
    }
    return "";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Center(
          child: Text(
            'Form Details',
            style: GoogleFonts.poppins(
                fontWeight: FontWeight.bold,
                color: Colors.white,
                letterSpacing: 1.5),
          ),
        ),
        titleSpacing: 2,
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(bottom: Radius.circular(20))),
        elevation: 3,
        shadowColor: Colors.grey.shade50,
        backgroundColor: Colors.black,
      ),
      body: FutureBuilder<FormDetails>(
        future: _formDetailsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (snapshot.hasData) {
            final formDetails = snapshot.data!;
            return Container(
              padding: EdgeInsets.symmetric(horizontal: 16.0),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Form(
                      key: _formKey,
                      child: Column(
                        children: formDetails.formFields
                            .map((field) => Padding(
                                  padding: EdgeInsets.symmetric(vertical: 8.0),
                                  child: _buildFormField(field),
                                ))
                            .toList(),
                      ),
                    ),
                    SizedBox(height: 20),
                    // Modified submit button with attendance check:
                    ElevatedButton(
                      onPressed: _isSubmitting
                          ? null
                          : () async {
                              // Check attendance (punch-in) first.
                              if (!_isPunchedIn) {
                                showDialog(
                                  context: context,
                                  builder: (context) => AlertDialog(
                                    title: Text("Attendance Required"),
                                    content: Text(
                                        "You must punch in before submitting the form."),
                                    actions: [
                                      TextButton(
                                        onPressed: () {
                                          Navigator.pop(context);
                                        },
                                        child: Text('OK'),
                                      ),
                                    ],
                                  ),
                                );
                                return;
                              }

                              // Then check if form is complete.
                              if (_formData.isEmpty && !_isImageUploaded) {
                                showDialog(
                                  context: context,
                                  builder: (context) => AlertDialog(
                                    title: Text("Incomplete Form"),
                                    content: Text(
                                        "Please fill out at least one field before submitting."),
                                    actions: [
                                      TextButton(
                                        onPressed: () {
                                          Navigator.pop(context);
                                        },
                                        child: Text('OK'),
                                      ),
                                    ],
                                  ),
                                );
                                return;
                              }

                              String result = await _submitForm();
                              showDialog(
                                context: context,
                                builder: (context) => AlertDialog(
                                  content: Text(result),
                                  actions: [
                                    TextButton(
                                      onPressed: () {
                                        Navigator.pop(context);
                                        if (result ==
                                            "Form Submitted Successfully!") {
                                          Navigator.pushReplacement(
                                            context,
                                            MaterialPageRoute(
                                              builder: (context) =>
                                                  SelectedFormsPage(
                                                formId: widget.formId,
                                                formTitle: widget.formTitle,
                                                promoterId: widget.promoterId,
                                              ),
                                            ),
                                          );
                                        }
                                      },
                                      child: Text('OK'),
                                    ),
                                  ],
                                ),
                              );
                            },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.black,
                        minimumSize: Size(double.infinity, 48),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: _isSubmitting
                          ? CircularProgressIndicator(
                              valueColor:
                                  AlwaysStoppedAnimation<Color>(Colors.white),
                            )
                          : Text(
                              'Submit',
                              style: GoogleFonts.poppins(color: Colors.white),
                            ),
                    ),
                    SizedBox(height: 10),
                  ],
                ),
              ),
            );
          } else {
            return Center(child: Text('No data available.'));
          }
        },
      ),
    );
  }
}
