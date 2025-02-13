import 'package:app/screens/attendance/AttendanceWidget.dart'
    as AttendanceWidget;
import 'package:app/screens/attendance/MarkYourAttendancePage.dart'
    as MarkAttendancePage;
import 'package:app/screens/attendance/ViewAttendance.dart';
import 'package:app/screens/form/FormAllFormsPage.dart';
import 'package:app/screens/profile/Profile.dart';
import 'package:app/utils/MainPageBox/MainPageBoxOne.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/PromoterDetailsModel.dart'; // Import the model
import '../../service/promoterService.dart'; // Import the service

class PromoterDetailsPage extends StatefulWidget {
  final String promoterId;
  const PromoterDetailsPage({super.key, required this.promoterId});

  @override
  _PromoterDetailsPageState createState() => _PromoterDetailsPageState();
}

class _PromoterDetailsPageState extends State<PromoterDetailsPage> {
  late Future<PromoterDetails> _promoterDetailsFuture;

  @override
  void initState() {
    super.initState();
    // Fetch promoter details using the promoterId
    _promoterDetailsFuture =
        PromoterService.fetchPromoterDetails(widget.promoterId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Flexible(
              child: FutureBuilder<PromoterDetails>(
                future: _promoterDetailsFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Text(
                      "Hi, Loading...",
                      style: GoogleFonts.poppins(
                        fontSize: 24,
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                      ),
                      overflow: TextOverflow.ellipsis,
                    );
                  } else if (snapshot.hasError) {
                    return Text(
                      "Hi, ${widget.promoterId}", // Fallback to promoterId if there's an error
                      style: GoogleFonts.poppins(
                        fontSize: 24,
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                      ),
                      overflow: TextOverflow.ellipsis,
                    );
                  } else if (snapshot.hasData) {
                    final promoterDetails = snapshot.data!;
                    return Text(
                      "Hi, ${promoterDetails.name}", // Display promoter's name
                      style: GoogleFonts.poppins(
                        fontSize: 24,
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                      ),
                      overflow: TextOverflow.ellipsis,
                    );
                  } else {
                    return Text(
                      "Hi, ${widget.promoterId}", // Fallback to promoterId if no data
                      style: GoogleFonts.poppins(
                        fontSize: 24,
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                      ),
                      overflow: TextOverflow.ellipsis,
                    );
                  }
                },
              ),
            ),
            GestureDetector(
              onTap: () {
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) =>
                            Profile(promoterId: widget.promoterId)));
              },
              child: Icon(
                Icons.person,
                color: const Color.fromARGB(255, 116, 116, 116),
                size: 25,
              ),
            ),
          ],
        ),
        automaticallyImplyLeading: false,
        backgroundColor: Colors.black,
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          double width = constraints.maxWidth;
          double boxHeight = width > 600 ? 120 : 100;
          double spacing = width > 600 ? 30 : 20;

          return SingleChildScrollView(
            child: Container(
              margin: const EdgeInsets.all(20),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  Column(
                    children: [
                      const SizedBox(height: 15),
                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) =>
                                  MarkAttendancePage.MarkYourAttendancePage(
                                      promoterId: widget.promoterId),
                            ),
                          );
                        },
                        child: AttendanceWidget.AttendanceWidget(),
                      ),
                      SizedBox(height: spacing),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: GestureDetector(
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => Formallformspage(
                                        promoterId: widget.promoterId),
                                  ),
                                );
                              },
                              child: Mainpageboxone(
                                title: "View Forms",
                                icon: Icons.view_agenda_outlined,
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: GestureDetector(
                              onTap: () => {
                                Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (context) =>
                                            ViewAttendancePage(
                                              promoterId: widget.promoterId,
                                            ))),
                              },
                              child: Mainpageboxone(
                                title: "Attendance",
                                icon: Icons.calendar_month_outlined,
                              ),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: spacing),
                    ],
                  ),
                  Image.asset(
                    'assets/SAND 1 logo.png',
                    height: width > 600 ? 35 : 25,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
