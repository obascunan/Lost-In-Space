/* Sweep
  by BARRAGAN <http://barraganstudio.com>
  This example code is in the public domain.

  modified 8 Nov 2013
  by Scott Fitzgerald
  http://www.arduino.cc/en/Tutorial/Sweep
*/

#include <Servo.h>

Servo servo1;
Servo servo2;
Servo servo3;
Servo servo4;
Servo servo5;


// create servo object to control a servo

// twelve servo objects can be created on most boards

int pos = 0;    // variable to store the servo position
int posShowing = 100;
int posResting = 10;

void setup() {
  servo1.attach(12);
  servo2.attach(11);
  servo3.attach(10);
  servo4.attach(9);
  servo5.attach(8);

  // attaches the servo on pin 9 to the servo object
//restAll();
}

void loop() {
  readSerialData();
}
void readSerialData()
{

  if (Serial.available() > 0)
  {
    int index = Serial.read();
    showFlag(index);
  }
  delay(30);
}
void restAll() {
  servo1.write(posResting);
  servo2.write(posResting);
  servo3.write(posResting);
  servo4.write(posResting);
  servo5.write(posResting);
}
void showFlag(int show) {
  switch (show) {
    case 0:
      servo1.write(posShowing);
      servo2.write(posResting);
      servo3.write(posResting);
      servo4.write(posResting);
      servo5.write(posResting);
      break;
    case 1:
      servo1.write(posResting);
      servo2.write(posShowing);
      servo3.write(posResting);
      servo4.write(posResting);
      servo5.write(posResting);
      break;
    case 2:
      servo1.write(posResting);
      servo2.write(posResting);
      servo3.write(posShowing);
      servo4.write(posResting);
      servo5.write(posResting);
      break;
    case 3:
      servo1.write(posResting);
      servo2.write(posResting);
      servo3.write(posResting);
      servo4.write(posShowing);
      servo5.write(posResting);
      break;
    case 4:
      servo1.write(posResting);
      servo2.write(posResting);
      servo3.write(posResting);
      servo4.write(posResting);
      servo5.write(posShowing);
      break;
    case 5:
      restAll();
      break;
    case 6:
      servo1.write(posShowing);
      servo2.write(posShowing);
      servo3.write(posShowing);
      servo4.write(posShowing);
      servo5.write(posShowing);
      break;
  }
}
