import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Leave, LeaveDocument } from './leave.schema';

@Injectable()
export class LeavesService {
  constructor(
    @InjectModel(Leave.name) private leaveModel: Model<LeaveDocument>,
  ) {}

  // Créer une nouvelle demande de congé
  async requestLeave(userId: string, dto: any) {
    const newLeave = new this.leaveModel({ userId, ...dto });
    return newLeave.save();
  }
// ✅ Mettre à jour le statut et logguer le résultat
  async updateStatus(leaveId: string, status: 'approved' | 'rejected') {
    const updatedLeave = await this.leaveModel.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }, // retourne le document mis à jour
    );
    console.log('🔹 Résultat updateStatus:', updatedLeave);
    return updatedLeave;
  }

  // Récupérer l'historique des congés d'un utilisateur
  async getUserLeaves(userId: string) {
    return this.leaveModel.find({ userId }).sort({ startDate: -1 });
  }

  // Récupérer toutes les demandes (admin)
  async getAllLeaves() {
    return this.leaveModel.find().populate('userId', 'nom email role');
  }
}
