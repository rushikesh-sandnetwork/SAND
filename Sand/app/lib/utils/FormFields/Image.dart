import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:image/image.dart' as img;
import 'package:geolocator/geolocator.dart';
import 'dart:io';

class ImagePickerWidget extends StatefulWidget {
  final String imageTitle;
  final void Function(String, File?)? onChanged;

  const ImagePickerWidget({required this.imageTitle, this.onChanged});

  @override
  _ImagePickerWidgetState createState() => _ImagePickerWidgetState();
}

class _ImagePickerWidgetState extends State<ImagePickerWidget> {
  final ImagePicker _picker = ImagePicker();
  String? _imagePath;
  bool _isLoadingImage = false;

  Future<void> _pickImage(ImageSource source) async {
    setState(() {
      _isLoadingImage = true; // Start loading
    });

    final pickedFile = await _picker.pickImage(source: source);
    if (pickedFile != null) {
      try {
        Position position = await _getCurrentLocation();
        String dateTime = _getCurrentDateTime();
        String latitude = position.latitude.toString();
        String longitude = position.longitude.toString();

        File imageWithText = await _addTextToImage(
          File(pickedFile.path),
          "Latitude: $latitude\nLongitude: $longitude\nDate & Time: $dateTime",
        );

        setState(() {
          _imagePath = imageWithText.path;
          _isLoadingImage = false; // Stop loading
        });

        widget.onChanged?.call(widget.imageTitle, imageWithText);
      } catch (e) {
        print("Error: $e");
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error: $e")),
        );
        setState(() {
          _isLoadingImage = false; // Stop loading
        });
      }
    } else {
      setState(() {
        _isLoadingImage = false; // Stop loading if no image is selected
      });
    }
  }

  Future<Position> _getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    // Check if location services are enabled
    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw Exception('Location services are disabled. Please enable them.');
    }

    // Check for location permission
    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('Location permissions are denied.');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw Exception(
          'Location permissions are permanently denied. Please enable them in settings.');
    }

    // If everything is fine, return the current position
    return await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high);
  }

  Future<File> _addTextToImage(File imageFile, String text) async {
    // Read image as bytes and decode it
    final imageBytes = await imageFile.readAsBytes();
    img.Image? originalImage = img.decodeImage(imageBytes);

    if (originalImage == null) {
      throw Exception("Unable to decode image.");
    }

    // Define text properties
    final int textX = 10;
    final int textY = 10;
    // final int fontSize = 24;
    final int textColor = img.getColor(255, 0, 0); // Red color

    // Draw text onto the image
    img.drawString(
      originalImage,
      img.arial_24,
      textX,
      textY,
      text,
      color: textColor,
    );

    // Encode the image back to bytes and write to a file
    final outputPath = "${imageFile.path}_with_text.jpg";
    final newImageFile = File(outputPath);
    await newImageFile.writeAsBytes(img.encodeJpg(originalImage));
    return newImageFile;
  }

  String _getCurrentDateTime() {
    final now = DateTime.now();
    return "${now.day}/${now.month}/${now.year}, ${now.hour}:${now.minute}:${now.second}";
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            widget.imageTitle,
            style:
                GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 20),
          ),
          SizedBox(height: 20),
          GestureDetector(
            onTap: () => _showImagePickerOptions(context),
            child: Container(
              width: double.infinity,
              height: 200,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey),
                borderRadius: BorderRadius.circular(12),
              ),
              child: _isLoadingImage
                  ? Center(
                      child:
                          CircularProgressIndicator()) // Show loading indicator
                  : _imagePath == null
                      ? Center(child: Text('Choose an Image'))
                      : ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Image.file(
                            File(_imagePath!),
                            fit: BoxFit.cover,
                          ),
                        ),
            ),
          ),
        ],
      ),
    );
  }

  void _showImagePickerOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SafeArea(
          child: Wrap(
            children: <Widget>[
              ListTile(
                leading: Icon(Icons.photo_library),
                title: Text('Choose from Gallery'),
                onTap: () {
                  Navigator.of(context).pop();
                  _pickImage(ImageSource.gallery);
                },
              ),
              ListTile(
                leading: Icon(Icons.camera_alt),
                title: Text('Take a Photo'),
                onTap: () {
                  Navigator.of(context).pop();
                  _pickImage(ImageSource.camera);
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
