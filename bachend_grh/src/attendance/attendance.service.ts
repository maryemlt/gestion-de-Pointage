import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance, AttendanceDocument } from './attendance.schema';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
  ) {}

  // ✅ Check-in
  async checkIn(userId: string) {
    const today = new Date().toISOString().split('T')[0];

    // Vérifie si déjà pointé aujourd'hui
    let attendance = await this.attendanceModel.findOne({ userId, date: today });
    if (attendance) return { message: 'Déjà pointé pour aujourd\'hui', attendance };

    const now = new Date();
    const newAttendance = new this.attendanceModel({
      userId,
      date: today,
      checkIn: now.toTimeString().slice(0, 5),
    });

    return newAttendance.save();
  }

  // ✅ Check-out
  async checkOut(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const attendance = await this.attendanceModel.findOne({ userId, date: today });

    if (!attendance) return { message: 'Aucun check-in trouvé pour aujourd\'hui' };
    if (attendance.checkOut) return { message: 'Déjà check-out pour aujourd\'hui' };

    const now = new Date();
    attendance.checkOut = now.toTimeString().slice(0, 5);

    // Calcul des heures travaillées
    const [inH, inM] = attendance.checkIn.split(':').map(Number);
    const [outH, outM] = attendance.checkOut.split(':').map(Number);
    const workedHours = (outH + outM / 60) - (inH + inM / 60);
    attendance.hoursWorked = Math.round(workedHours * 100) / 100;

    return attendance.save();
  }

  // ✅ Historique utilisateur
  async getUserHistory(userId: string) {
    return this.attendanceModel.find({ userId }).sort({ date: -1 });
  }
}
