import 'package:flutter/material.dart';

class DropDownField extends StatefulWidget {
  final String title;
  final Map<String, dynamic> options;
  final Function(Map<String, String?>) onChanged;

  const DropDownField({
    required this.title,
    required this.options,
    required this.onChanged,
    Key? key,
  }) : super(key: key);

  @override
  _DropDownFieldState createState() => _DropDownFieldState();
}

class _DropDownFieldState extends State<DropDownField> {
  late List<String> headers;
  late Map<String, dynamic> data;
  Map<String, String?> selectedValues = {};

  @override
  void initState() {
    super.initState();
    headers = List<String>.from(widget.options['headers'] ?? []);
    data = Map<String, dynamic>.from(widget.options['data'] ?? {});
    for (var header in headers) {
      selectedValues[header] = null;
    }
  }

  void _onValueSelected(String header, String? value) {
    setState(() {
      selectedValues[header] = value;
      final currentIndex = headers.indexOf(header);

      // Clear dependent levels when a parent value changes
      for (var i = currentIndex + 1; i < headers.length; i++) {
        selectedValues[headers[i]] = null;
      }

      widget.onChanged(Map.from(selectedValues));
    });
  }

  List<String> _getOptionsForHeader(String header) {
    final currentIndex = headers.indexOf(header);

    if (currentIndex == 0) {
      // Top-level options
      return data[header]?.map<String>((e) => e[0].toString()).toList() ?? [];
    }

    final parentHeader = headers[currentIndex - 1];
    final parentValue = selectedValues[parentHeader];

    if (parentValue != null && data.containsKey(parentValue)) {
      return data[parentValue]?.map<String>((e) => e[0].toString()).toList() ??
          [];
    }

    return [];
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.title,
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        ...headers.map((header) {
          final isEnabled = headers.indexOf(header) == 0 ||
              selectedValues[headers[headers.indexOf(header) - 1]] != null;

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(height: 16),
              Text('Choose $header:', style: TextStyle(fontSize: 14)),
              DropdownButton<String>(
                value: selectedValues[header],
                hint: Text('Select $header'),
                items: isEnabled
                    ? _getOptionsForHeader(header).map((option) {
                        return DropdownMenuItem(
                          value: option,
                          child: Text(option),
                        );
                      }).toList()
                    : [],
                onChanged: isEnabled
                    ? (value) => _onValueSelected(header, value)
                    : null,
              ),
            ],
          );
        }).toList(),
      ],
    );
  }
}
