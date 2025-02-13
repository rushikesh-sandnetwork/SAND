import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class Heading extends StatefulWidget {
  final FormFieldSetter<String>? onChanged;
  final String? initialValue;
  final String headingTitle;

  Heading(
      {Key? key, this.onChanged, this.initialValue, required this.headingTitle})
      : super(key: key);

  @override
  _HeadingState createState() => _HeadingState();
}

class _HeadingState extends State<Heading> {
  late TextEditingController _headingController;

  @override
  void initState() {
    super.initState();
    _headingController = TextEditingController(text: widget.initialValue);
  }

  @override
  void dispose() {
    _headingController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            widget.headingTitle,
            style:
                GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 20),
          ),
          SizedBox(height: 10),
          TextFormField(
            controller: _headingController,
            onChanged: widget.onChanged,
            decoration: InputDecoration(
              hintText: 'Enter subheading...',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            style: GoogleFonts.poppins(),
          ),
        ],
      ),
    );
  }
}
