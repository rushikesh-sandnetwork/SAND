import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class MultipleChoiceField extends StatefulWidget {
  final FormFieldSetter<Map<String, dynamic>>? onChanged;
  final String multipleChoiceFieldTitle;
  final List<String>? initialValue;

  const MultipleChoiceField({
    this.onChanged,
    this.initialValue,
    required this.multipleChoiceFieldTitle,
  });

  @override
  State<MultipleChoiceField> createState() => _MultipleChoiceFieldState();
}

class _MultipleChoiceFieldState extends State<MultipleChoiceField> {
  late String title;
  late List<String> choices;
  late List<String> selectedChoices;

  @override
  void initState() {
    super.initState();

    // Split the title and options
    List<String> items = widget.multipleChoiceFieldTitle
        .split(',')
        .map((item) => item.trim())
        .toList();

    title = items.first; // First element is the title
    choices = items.sublist(1); // Remaining elements are choices
    selectedChoices = widget.initialValue ?? [];
  }

  void _onChoiceChanged(bool selected, String choice) {
    setState(() {
      if (selected) {
        selectedChoices.add(choice);
      } else {
        selectedChoices.remove(choice);
      }
    });

    if (widget.onChanged != null) {
      widget.onChanged!({
        "title": title,
        "type": "Multiple Choice",
        "selectedChoices": selectedChoices,
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title
          Text(
            title,
            style:
                GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 20),
          ),
          SizedBox(height: 16),
          // Checkboxes for choices
          Column(
            children: choices.map((choice) {
              return CheckboxListTile(
                title: Text(choice, style: GoogleFonts.poppins()),
                value: selectedChoices.contains(choice),
                onChanged: (selected) {
                  _onChoiceChanged(selected ?? false, choice);
                },
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}
