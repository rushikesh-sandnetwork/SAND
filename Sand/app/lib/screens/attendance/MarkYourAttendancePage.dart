import 'dart:io';
import 'package:app/screens/attendance/CheckWidgets.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:path/path.dart' as path;
import 'package:async/async.dart';
import 'package:image/image.dart' as img;
import 'package:geolocator/geolocator.dart';
import 'package:intl/intl.dart';
// import 'package:intl/date_symbol_data_local.dart';

class MarkYourAttendancePage extends StatefulWidget {
  final String promoterId;

  const MarkYourAttendancePage({required this.promoterId, Key? key})
      : super(key: key);

  @override
  State<MarkYourAttendancePage> createState() => _MarkYourAttendancePageState();
}

class _MarkYourAttendancePageState extends State<MarkYourAttendancePage> {
  String checkChoice = 'default';
  File? _checkInImage;
  File? _checkOutImage;

  bool isPunchInLoading = false;
  bool isPunchOutLoading = false;

  final ImagePicker _picker = ImagePicker();

  String getCurrentIndianDateTimeFormatted() {
    final now = DateTime.now();
    final formatter = DateFormat('dd-MM-yyyy, hh:mm:ss', 'en_IN');
    return formatter.format(now);
  }

  Future<void> _ensureLocationPermission() async {
    LocationPermission permission = await Geolocator.checkPermission();

    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception("Location permission denied by the user.");
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw Exception(
          "Location permissions are permanently denied. Enable them from settings.");
    }
  }

  Future<void> _pickImage(String choice) async {
    try {
      final pickedFile = await _picker.pickImage(source: ImageSource.camera);
      if (pickedFile == null) return;

      File imageFile = File(pickedFile.path);
      await _ensureLocationPermission();

      // Get the current location
      Position position = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high);
      String latitude = position.latitude.toStringAsFixed(7);
      String longitude = position.longitude.toStringAsFixed(7);

      final currentDateTime = getCurrentIndianDateTimeFormatted();
      // Get the current date and time
      // String currentDateTime = DateTime.now().toIso8601String();

      // Load the image
      img.Image? image = img.decodeImage(imageFile.readAsBytesSync());
      if (image == null) throw Exception("Failed to load image.");

      // Annotate the image with text
      img.drawString(
        image,
        img.arial_24,
        10,
        10,
        'Latitude: $latitude\nLongtitude: $longitude\nDate & Time: $currentDateTime',
        color: img.getColor(255, 0, 0), // Red text
      );

      // Save the annotated image
      File processedImage = File(imageFile.path)
        ..writeAsBytesSync(img.encodeJpg(image));

      setState(() {
        if (choice == "checkIn") {
          _checkInImage = processedImage;
        } else {
          _checkOutImage = processedImage;
        }
      });
    } catch (e) {
      showCustomSnackBar(context, "Error capturing image: $e", true);
    }
  }

  Future<String> _submit(
      String choice, File? imageFile, String promoterId) async {
    try {
      final url = Uri.parse(
          'https://sand-backend.onrender.com/api/v1/promoter/$choice');
      var request = http.MultipartRequest('POST', url);

      request.fields['promoterId'] = promoterId;

      String fileOption =
          choice == "fillAttendancePunchIn" ? "loginPhoto" : "logOutPhoto";

      if (imageFile != null) {
        var stream =
            http.ByteStream(DelegatingStream.typed(imageFile.openRead()));
        var length = await imageFile.length();
        var multipartFile = http.MultipartFile(
          fileOption,
          stream,
          length,
          filename: path.basename(imageFile.path),
        );
        request.files.add(multipartFile);
      }

      var response = await request.send();
      var responseBody = await http.Response.fromStream(response);

      if (response.statusCode == 201) {
        return "Submitted successfully.";
      } else if (response.statusCode == 400) {
        var responseData = json.decode(responseBody.body);
        return "Error: ${responseData['message']}";
      } else {
        return "Error: ${response.statusCode}";
      }
    } catch (error) {
      return "Error: $error";
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        leading: GestureDetector(
          onTap: () => Navigator.pop(context),
          child: const Icon(
            Icons.arrow_back_ios_new,
            color: Colors.grey,
            size: 18,
          ),
        ),
        title: Text(
          "Mark your Attendance",
          style: GoogleFonts.poppins(
              fontSize: 16, color: Colors.white, fontWeight: FontWeight.w600),
        ),
        backgroundColor: Colors.black,
      ),
      body: Column(
        children: [
          Column(
            children: [
              GestureDetector(
                onTap: () => setState(() => checkChoice = 'CheckIn'),
                child: const CheckWidgets(
                  checkTitle: "Punch In",
                  icon: Icons.more_time_sharp,
                ),
              ),
              GestureDetector(
                onTap: () => setState(() => checkChoice = 'CheckOut'),
                child: const CheckWidgets(
                  checkTitle: "Punch Out",
                  icon: Icons.timer_outlined,
                ),
              ),
            ],
          ),
          Expanded(
            child: Container(
              margin: const EdgeInsets.only(top: 20),
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.grey.shade800.withOpacity(0.1), Colors.black],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(40.0),
                  topRight: Radius.circular(40.0),
                ),
              ),
              child: Center(
                child: checkChoice == 'CheckIn'
                    ? AttendanceWidget(
                        image: _checkInImage,
                        isLoading: isPunchInLoading,
                        onPickImage: () => _pickImage('checkIn'),
                        onSubmit: () async {
                          setState(() => isPunchInLoading = true);
                          String message = await _submit(
                              'fillAttendancePunchIn',
                              _checkInImage,
                              widget.promoterId);
                          setState(() {
                            isPunchInLoading = false;
                            _checkInImage = null;
                          });
                          showCustomSnackBar(
                              context, message, message.startsWith("Error"));
                        },
                        buttonText: "Punch In",
                      )
                    : AttendanceWidget(
                        image: _checkOutImage,
                        isLoading: isPunchOutLoading,
                        onPickImage: () => _pickImage('checkOut'),
                        onSubmit: () async {
                          setState(() => isPunchOutLoading = true);
                          String message = await _submit(
                              'fillAttendancePunchOut',
                              _checkOutImage,
                              widget.promoterId);
                          setState(() {
                            isPunchOutLoading = false;
                            _checkOutImage = null;
                          });
                          showCustomSnackBar(
                              context, message, message.startsWith("Error"));
                        },
                        buttonText: "Punch Out",
                      ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class AttendanceWidget extends StatelessWidget {
  final File? image;
  final bool isLoading;
  final VoidCallback onPickImage;
  final VoidCallback onSubmit;
  final String buttonText;

  const AttendanceWidget({
    required this.image,
    required this.isLoading,
    required this.onPickImage,
    required this.onSubmit,
    required this.buttonText,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        image == null ? Container() : ImagePreview(image!),
        const SizedBox(height: 20),
        ElevatedButton(
          style: buttonStyle,
          onPressed: onPickImage,
          child: Text('Click Photo', style: buttonTextStyle),
        ),
        const SizedBox(height: 20),
        ElevatedButton(
          style: buttonStyle,
          onPressed: isLoading ? null : onSubmit,
          child: isLoading
              ? const CircularProgressIndicator(color: Colors.white)
              : Text(buttonText, style: buttonTextStyle),
        ),
      ],
    );
  }
}

void showCustomSnackBar(BuildContext context, String message, bool isError) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(
        message,
        style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: isError ? Colors.red : Colors.green),
      ),
      backgroundColor: Colors.black,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15.0),
      ),
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
    ),
  );
}

Widget ImagePreview(File imageFile) {
  return Container(
    height: 200,
    width: 200,
    decoration: BoxDecoration(
      borderRadius: BorderRadius.circular(20),
      border: Border.all(color: Colors.grey.withOpacity(0.8), width: 2),
    ),
    child: ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: Image.file(imageFile, fit: BoxFit.cover),
    ),
  );
}

final ButtonStyle buttonStyle = ElevatedButton.styleFrom(
  backgroundColor: Colors.grey,
  foregroundColor: Colors.white,
  padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 25),
);

final TextStyle buttonTextStyle =
    GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold);
