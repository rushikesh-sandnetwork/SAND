import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class Number extends StatefulWidget {
  final FormFieldSetter<String>? onChanged;
  final String? initialValue;
  final String numberTitle;

  Number(
      {Key? key, this.onChanged, this.initialValue, required this.numberTitle})
      : super(key: key);

  @override
  _NumberState createState() => _NumberState();
}

class _NumberState extends State<Number> {
  late TextEditingController _numberController;

  @override
  void initState() {
    super.initState();
    _numberController = TextEditingController(text: widget.initialValue);
  }

  @override
  void dispose() {
    _numberController.dispose();
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
            widget.numberTitle,
            style:
                GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 20),
          ),
          SizedBox(height: 20),
          TextFormField(
            onChanged: widget.onChanged,
            controller: _numberController,
            keyboardType: TextInputType.number,
            decoration: InputDecoration(
              hintText: 'Enter your number here...',
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
