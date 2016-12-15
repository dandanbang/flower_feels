/*
 * Servo Control Serial
 * modified for TUI October 2007
 * Servo Serial Better
 * -------------------
 *
 * Created 18 October 2006
 * copyleft 2006 Tod E. Kurt <tod@todbot.com>
 * http://todbot.com/
 *
 * adapted from "http://itp.nyu.edu/physcomp/Labs/Servo"
 */
const int pinSound = A1;//Fay added
int fsrAnalogPin = 0; //Fay added
//int fsrReading;
int servoPin = 7;      // Control pin for servo motor
//int blueLEDPin = 11;
//int greenLEDPin= 12;
//int redLEDPin = 13;
int LEDbrightness; //added
int pulseWidth = 0;    // Amount to pulse the servo
long lastPulse = 0;    // the time in millisecs of the last pulse
int refreshTime = 20;  // the time in millisecs needed in between pulses
int val;               // variable used to store data from serial port
int minPulse = 500;   // minimum pulse width
int maxPulse = 2250;  // maximum pulse width
int thresholdValue = 300;//Fay added
char serInString[100];  
int redVal, greenVal, blueVal;
int redCurr = 127;
int greenCurr = 127;
int blueCurr = 127;
int increRed, increBlue, increGreen;
int redPin   = 13;   
int greenPin = 12;  
int bluePin  = 11; 
int redPre = 127;
int bluePre = 127;
int greenPre = 127;
char inChar=-1; // Where to store the character read

void setup() {
  pinMode(redPin,   OUTPUT);  
  pinMode(greenPin, OUTPUT);   
  pinMode(bluePin,  OUTPUT);
  Serial.begin(9600);
  analogWrite(redPin,   redPre);   
  analogWrite(greenPin, bluePre);   
  analogWrite(bluePin,  greenPre); 
  pinMode(servoPin, OUTPUT);  // Set servo pin as an output pin
  pulseWidth = minPulse;      // Set the motor position to the minimum
  Serial.begin(9600);         // connect to the serial port
}
void printSerial() {
  Serial.print("setting color ");
  Serial.print("red");
  Serial.print(" to ");
  Serial.print(redCurr);
  Serial.println(); 
  Serial.print("setting color ");
  Serial.print("blue");
  Serial.print(" to ");
  Serial.print(blueCurr);
  Serial.println();
  Serial.print("setting color ");
  Serial.print("green");
  Serial.print(" to ");
  Serial.print(greenCurr);
  Serial.println();
}
void loop() {

  // listen to the emotion data
   if (Serial.available() > 0) {
     // read the incoming byte:
     inChar = Serial.read();
     // say what you got:
     Serial.print("I received: ");
     Serial.println(inChar);
   }
  
  memset(serInString, 0, 100);
  readSerialString(serInString);
  int fsrReading = analogRead(fsrAnalogPin);
  Serial.println(fsrReading);
//  Serial.print("FSR Analog reading = ");
//  Serial.println(fsrReading);
  LEDbrightness = map(fsrReading, 0, 1023, 0, 255);// LED gets brighter the harder you press
//  analogWrite(blueLEDPin, LEDbrightness);
  
//  digitalWrite(redLEDPin, HIGH);   // turn the LED on (HIGH is the voltage level)
//  val = Serial.read();      // read the serial port - Fay commented
  val = analogRead(pinSound); // added by Fay
//  Serial.print("pinSound Analog reading = ");
//  Serial.println(val);
  
  if (val >= '1' && val <= '9' ) {
    val = val - '0';        // convert val from character variable to number variable
    val = val - 1;          // make val go from 0-8
    pulseWidth = (val * (maxPulse-minPulse) / 8) + minPulse;  // convert val to microseconds
//    Serial.print("Moving servo to position ");
//    Serial.println(pulseWidth,DEC);
  }
  updateServo();   // update servo position

  if (inChar=='J') {
    // happiness is orange
    redCurr = 255;
    greenCurr = 127;
    blueCurr = 0;
    printSerial();
    serInString[0] = ' ';    
  }

  if (inChar=='U') {
    // sad is purple
    redCurr = 127;
    greenCurr = 0;
    blueCurr = 255;
    printSerial();
    serInString[0] = ' ';    
  }
  
  if (inChar=='S') {
    // surprise is cyan
    redCurr = 0;
    greenCurr = 255;
    blueCurr = 255;
    printSerial();
    serInString[0] = ' ';
  }

  if (inChar=='A') {
    // angry is red
    redCurr = 255;
    greenCurr = 0;
    blueCurr = 0;
    printSerial();
    serInString[0] = ' ';
  }

  if (inChar=='D') {
    // disgust is green
    redCurr = 0;
    greenCurr = 255;
    blueCurr = 0;
    printSerial();
    serInString[0] = ' ';
  }
  
  if(redPre > redCurr) {
    increRed = -1;
  }
  else {
    increRed = 1;
  }
  redVal = redPre;
  while(redVal != redCurr) {
    analogWrite(redPin, redVal);
    delay(10);
    redVal += increRed;
  }
  redPre = redCurr;
  
  if(bluePre > blueCurr) {
    increBlue = -1;
  }
  else {
    increBlue = 1;
  }
  blueVal = bluePre;
  while(blueVal != blueCurr) {
    analogWrite(bluePin, blueVal);
    delay(10);
    blueVal += increBlue;
  }
  bluePre = blueCurr;
  if(greenPre > greenCurr) {
    increGreen = -1;
  }
  else {
    increGreen = 1;
  }
  greenVal = greenPre;
  while(greenVal != greenCurr) {
    analogWrite(greenPin, greenVal);
    greenVal += increGreen;
    delay(10);
  }
  greenPre = greenCurr;
  delay(100);
}

// called every loop(). 
// uses global variables servoPi, pulsewidth, lastPulse, & refreshTime
void readSerialString (char *strArray) {
  int j = 0;
  if(!Serial.available()) {
    return;
  }
  while (Serial.available()) {
    strArray[j] = Serial.read();
    j++;
  }
}

void updateServo() {
  // pulse the servo again if rhe refresh time (20 ms) have passed:
  if (millis() - lastPulse >= refreshTime) {
    digitalWrite(servoPin, HIGH);   // Turn the motor on
    delayMicroseconds(pulseWidth);  // Length of the pulse sets the motor position
    digitalWrite(servoPin, LOW);    // Turn the motor off
    lastPulse = millis();           // save the time of the last pulse
  }
}
