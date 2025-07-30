import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Leave, LeaveDocument } from './leave.schema';
import { Attendance, AttendanceDocument } from '../attendance/attendance.schema'; // ✅ pour relier à Attendance

@Injectable()
export class LeavesService {
  constructor(
    @InjectModel(Leave.name) private leaveModel: Model<LeaveDocument>,
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>, // ✅ injecter le modèle Attendance
  ) {}

  // Créer une nouvelle demande de congé
  async requestLeave(userId: string, dto: any) {
    const newLeave = new this.leaveModel({ userId, ...dto });
    return newLeave.save();
  }

  // ✅ Mettre à jour le statut et ajouter les absences si approuvé
  async updateStatus(leaveId: string, status: 'approved' | 'rejected') {
    const updatedLeave = await this.leaveModel.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true },
    );

    if (!updatedLeave) return null;

    // Si le congé est approuvé → créer des absences dans Attendance
    if (status === 'approved') {
      const start = new Date(updatedLeave.startDate);
      const end = new Date(updatedLeave.endDate);

      const absences: Partial<Attendance>[] = [];

for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
  const formattedDate = d.toISOString().split('T')[0];

  absences.push({
    userId: (updatedLeave.userId as any)._id ?? updatedLeave.userId,
    date: formattedDate,
    status: 'absent', // ✅ maintenant reconnu
  });
}


      await this.attendanceModel.insertMany(absences);
      console.log(`🔹 ${absences.length} jours d'absence ajoutés`);
    }

    return updatedLeave;
  }

  // Récupérer l'historique des congés d'un utilisateur
  async getUserLeaves(userId: string) {
    return this.leaveModel.find({ userId }).sort({ startDate: -1 });
  }

  // Récupérer toutes les demandes pour l'admin
  async getAllLeaves() {
    return this.leaveModel.find().populate('userId', 'nom email role');
  }
}
