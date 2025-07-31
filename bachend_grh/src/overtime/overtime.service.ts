import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Overtime, OvertimeDocument } from './overtime.schema';
import { Attendance, AttendanceDocument } from '../attendance/attendance.schema';

@Injectable()
export class OvertimeService {
  constructor(
    @InjectModel(Overtime.name) private overtimeModel: Model<OvertimeDocument>,
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
  ) {}

  // ✅ Calculer et stocker les heures supplémentaires
  async calculateOvertime(userId: string, date: string): Promise<Overtime | null> {
    const attendance = await this.attendanceModel.findOne({ userId, date });

    if (!attendance || !attendance.checkIn || !attendance.checkOut) {
      console.log('❌ Pas de pointage complet pour cette date');
      return null;
    }

    // Calcul des heures travaillées
    const [inH, inM] = attendance.checkIn.split(':').map(Number);
    const [outH, outM] = attendance.checkOut.split(':').map(Number);

    const workedHours = (outH + outM / 60) - (inH + inM / 60);
    const overtimeHours = workedHours > 8 ? workedHours - 8 : 0;

    if (overtimeHours > 0) {
      const overtime = new this.overtimeModel({ userId, date, hours: overtimeHours });
      return overtime.save();
    }

    console.log('ℹ️ Aucune heure supplémentaire détectée');
    return null;
  }

  // ✅ Récupérer l'historique des heures sup d'un utilisateur
  async getUserOvertime(userId: string): Promise<Overtime[]> {
    return this.overtimeModel.find({ userId }).sort({ date: -1 });
  }

  // ✅ Récupérer toutes les heures sup (Admin)
  async getAllOvertime(): Promise<Overtime[]> {
    return this.overtimeModel.find().populate('userId', 'nom email');
  }
}
