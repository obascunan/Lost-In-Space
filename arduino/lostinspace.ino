/***********************************
 * 
 *    Creation and Computation Experiment 3 
 * 
 *    Ania Medrek & Orlando Bascunan
 * 
 *    Arduino Code 
 *     
 * 
 *    November 2016
 * 
 */ //////////////////////////////////



#include <Servo.h>

Servo servo1;
Servo servo2;
Servo servo3;
Servo servo4;
Servo servo5;



int pos = 0;   
// Showing Angle for servos
int posShowing = 100;
// Hidden Angle for servos
int posResting = 10;

void setup() {
  servo1.attach(12);
  servo2.attach(11);
  servo3.attach(10);
  servo4.attach(9);
  servo5.attach(8);

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

// Receiving a number show a flag or hide them all.

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
