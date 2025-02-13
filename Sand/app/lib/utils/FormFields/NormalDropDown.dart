import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

// class NormalDropDownField extends StatefulWidget {
//   final FormFieldSetter<String>? onChanged;
//   final String? initialValue;
//   final String dropDownFieldTile;

//   const NormalDropDownField({
//     this.onChanged,
//     this.initialValue,
//     required this.dropDownFieldTile,
//   });

//   @override
//   State<NormalDropDownField> createState() => _NormalDropDownFieldState();
// }

// class _NormalDropDownFieldState extends State<NormalDropDownField> {
//   late String title;
//   late List<String> dropDownItems;
//   String? selectedValue;

//   @override
//   void initState() {
//     super.initState();
//     // Split the string and assign the first item as the title
//     List<String> items =
//         widget.dropDownFieldTile.split(',').map((item) => item.trim()).toList();
//     title = items.first;
//     dropDownItems = items.sublist(1); // All items after the first are options

//     selectedValue = widget.initialValue ?? dropDownItems.first;
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       padding: const EdgeInsets.all(16.0),
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           // Display the title
//           Text(
//             title,
//             style:
//                 GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 20),
//           ),
//           SizedBox(height: 16),
//           // Display the dropdown
//           DropdownButtonFormField<String>(
//             value: selectedValue,
//             items: dropDownItems.map((String value) {
//               return DropdownMenuItem<String>(
//                 value: value,
//                 child: Text(
//                   value,
//                   style: GoogleFonts.poppins(),
//                 ),
//               );
//             }).toList(),
//             onChanged: (newValue) {
//               setState(() {
//                 selectedValue = newValue;
//               });
//               if (widget.onChanged != null) {
//                 widget.onChanged!(newValue!);
//               }
//             },
//             decoration: InputDecoration(
//               labelText: 'Select an Option',
//               labelStyle: GoogleFonts.poppins(fontWeight: FontWeight.normal),
//               border: OutlineInputBorder(),
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }
class NormalDropDownField extends StatefulWidget {
  final FormFieldSetter<Map<String, dynamic>>? onChanged;
  final Map<String, dynamic>? initialValue;
  final String dropDownFieldTitle;

  const NormalDropDownField({
    this.onChanged,
    this.initialValue,
    required this.dropDownFieldTitle,
  });

  @override
  State<NormalDropDownField> createState() => _NormalDropDownFieldState();
}

class _NormalDropDownFieldState extends State<NormalDropDownField> {
  late String title;
  late List<String> dropDownItems;
  String? selectedValue;

  @override
  void initState() {
    super.initState();
    List<String> items = widget.dropDownFieldTitle
        .split(',')
        .map((item) => item.trim())
        .toList();
    title = items.first;
    dropDownItems = items.sublist(1);

    selectedValue =
        widget.initialValue?['selectedValue'] ?? dropDownItems.first;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style:
                GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 20),
          ),
          SizedBox(height: 16),
          DropdownButtonFormField<String>(
            value: selectedValue,
            items: dropDownItems.map((String value) {
              return DropdownMenuItem<String>(
                value: value,
                child: Text(
                  value,
                  style: GoogleFonts.poppins(),
                ),
              );
            }).toList(),
            onChanged: (newValue) {
              setState(() {
                selectedValue = newValue;
              });
              if (widget.onChanged != null) {
                widget.onChanged!({
                  "title": title,
                  "type": "NormalDropDown",
                  "selectedValue": newValue,
                });
              }
            },
            decoration: InputDecoration(
              labelText: 'Select an Option',
              labelStyle: GoogleFonts.poppins(fontWeight: FontWeight.normal),
              border: OutlineInputBorder(),
            ),
          ),
        ],
      ),
    );
  }
}
