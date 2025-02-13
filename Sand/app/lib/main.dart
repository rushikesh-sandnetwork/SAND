import 'package:app/LoginPage.dart';
import 'package:app/screens/form/PromoterDetailsPage.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/date_symbol_data_local.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeDateFormatting('en_IN', null);

  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  Widget _defaultHome = LoginPage();

  @override
  void initState() {
    super.initState();
    checkLoginStatus();
  }

  Future<void> checkLoginStatus() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? promoterId = prefs.getString('promoterId');
    int? loginTime = prefs.getInt('loginTime');

    if (promoterId != null && loginTime != null) {
      int currentTime = DateTime.now().millisecondsSinceEpoch;
      int expiryTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if ((currentTime - loginTime) < expiryTime) {
        setState(() {
          _defaultHome = PromoterDetailsPage(promoterId: promoterId);
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: _defaultHome,
    );
  }
}
