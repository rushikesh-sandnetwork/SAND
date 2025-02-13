import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:photo_view/photo_view.dart';

Future<List<Map<String, dynamic>>> fetchFormFilledData(String formId) async {
  final response = await http.post(
    Uri.parse(
        'https://sand-backend.onrender.com/api/v1/promoter/fetchFormFilledData'),
    headers: {'Content-Type': 'application/json'},
    body: json.encode({'formId': formId}),
  );

  if (response.statusCode == 200) {
    final responseData = json.decode(response.body);
    if (responseData['statuscode'] == 200) {
      return List<Map<String, dynamic>>.from(responseData['data']);
    } else {
      throw Exception(responseData['message']);
    }
  } else {
    throw Exception('Failed to load data');
  }
}

class FormDataScreen extends StatelessWidget {
  final String formId;

  const FormDataScreen({super.key, required this.formId});

  void _showImageModal(BuildContext context, String imageUrl) {
    showDialog(
      context: context,
      builder: (context) {
        return GestureDetector(
          onTap: () => Navigator.of(context).pop(),
          child: Scaffold(
            backgroundColor: Colors.black.withOpacity(0.9),
            body: Center(
              child: PhotoView(
                imageProvider: NetworkImage(imageUrl),
                backgroundDecoration: const BoxDecoration(
                  color: Colors.transparent,
                ),
                minScale: PhotoViewComputedScale.contained,
                maxScale: PhotoViewComputedScale.covered * 3.0,
              ),
            ),
          ),
        );
      },
    );
  }

  /// Function to parse and format the JSON-like object strings
  Widget buildKeyValueRow(BuildContext context, String key, dynamic value) {
    if (key == '_id') {
      // Exclude `_id` from display
      return const SizedBox.shrink();
    }

    final isJsonLike =
        value is String && value.startsWith('{') && value.endsWith('}');
    Widget valueWidget;

    if (isJsonLike) {
      try {
        // Parse JSON-like string into a Map
        final Map<String, dynamic> parsedData =
            json.decode(value.replaceAll("'", '"'));

        valueWidget = Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: parsedData.entries.map((entry) {
            return Padding(
              padding: const EdgeInsets.only(left: 16.0, bottom: 4.0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${entry.key}: ',
                    style: GoogleFonts.poppins(
                      fontWeight: FontWeight.bold,
                      color: Colors.grey[300],
                      fontSize:
                          MediaQuery.of(context).size.width < 600 ? 14 : 16,
                    ),
                  ),
                  Flexible(
                    child: Text(
                      entry.value.toString(),
                      style: GoogleFonts.poppins(
                        color: Colors.grey[300],
                        fontSize:
                            MediaQuery.of(context).size.width < 600 ? 14 : 16,
                      ),
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        );
      } catch (e) {
        valueWidget = Text(
          value.toString(),
          style: GoogleFonts.poppins(
            color: Colors.grey[300],
            fontSize: MediaQuery.of(context).size.width < 600 ? 14 : 16,
          ),
        );
      }
    } else {
      valueWidget = Text(
        value.toString(),
        style: GoogleFonts.poppins(
          color: Colors.grey[300],
          fontSize: MediaQuery.of(context).size.width < 600 ? 14 : 16,
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '$key:',
            style: GoogleFonts.poppins(
              fontWeight: FontWeight.bold,
              color: Colors.teal[200],
              fontSize: MediaQuery.of(context).size.width < 600 ? 14 : 16,
            ),
          ),
          const SizedBox(height: 4.0),
          valueWidget,
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back_ios_new,
            color: Colors.grey,
            size: 18,
          ),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        title: Text(
          "View Data",
          style: GoogleFonts.poppins(
            fontSize: 16,
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
        backgroundColor: Colors.black,
      ),
      backgroundColor: Colors.black,
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: fetchFormFilledData(formId),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(
              child: Text('Error: ${snapshot.error}',
                  style: const TextStyle(color: Colors.white)),
            );
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(
              child: Text('No data available',
                  style: TextStyle(color: Colors.white)),
            );
          } else {
            final data = snapshot.data!;
            return ListView.builder(
              padding:
                  const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              itemCount: data.length,
              itemBuilder: (context, index) {
                final entry = data[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12.0),
                  color: Colors.grey[900],
                  elevation: 4.0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: entry.entries.map((e) {
                        String key = e.key;
                        dynamic value = e.value;

                        // ✅ Fix: Show "Data Accepted: Yes/No" instead of "acceptedData"
                        if (key == "acceptedData") {
                          key = "Data Accepted";
                          value = (value == true) ? "Yes" : "No";
                        }
                        bool isImage = e.value
                            .toString()
                            .startsWith('http://res.cloudinary');
                        return isImage
                            ? Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // ✅ Show Image Title
                                  Text(
                                    key, // Image Title Displayed
                                    style: GoogleFonts.poppins(
                                      fontWeight: FontWeight.bold,
                                      color: Colors.teal[200],
                                      fontSize:
                                          MediaQuery.of(context).size.width <
                                                  600
                                              ? 14
                                              : 16,
                                    ),
                                  ),
                                  const SizedBox(
                                      height:
                                          4.0), // Space between title & image
                                  GestureDetector(
                                    onTap: () =>
                                        _showImageModal(context, value),
                                    child: Image.network(
                                      value.toString(),
                                      height: 120,
                                      fit: BoxFit.cover,
                                      width: double.infinity,
                                    ),
                                  ),
                                ],
                              )
                            : buildKeyValueRow(context, key, value);
                      }).toList(),
                    ),
                  ),
                );
              },
            );
          }
        },
      ),
    );
  }
}
