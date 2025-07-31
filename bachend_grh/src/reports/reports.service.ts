import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';

import { Leave, LeaveDocument } from '../leaves/leave.schema';
import { Attendance, AttendanceDocument } from '../attendance/attendance.schema';
import { Overtime, OvertimeDocument } from '../overtime/overtime.schema';
import { User, UserDocument } from '../users/user.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Leave.name) private leaveModel: Model<LeaveDocument>,
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
    @InjectModel(Overtime.name) private overtimeModel: Model<OvertimeDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /** 🔹 Génère un PDF complet en streaming direct */
  async generateFullReportStream(userId: string, res: Response) {
    // --- Récupération des données ---
    const user = await this.userModel.findById(userId).lean();
    const leaves = await this.leaveModel.find({ userId }).sort({ startDate: 1 }).lean();
    const attendance = await this.attendanceModel.find({ userId }).sort({ date: 1 }).lean();
    const overtime = await this.overtimeModel.find({ userId }).sort({ date: 1 }).lean();

    // 🔹 Calcul des retards (Check-in après 09:15)
    const lateArrivals = attendance
      .filter(a => a.checkIn)
      .filter(a => {
        const [hour, minute] = a.checkIn.split(':').map(Number);
        return hour > 9 || (hour === 9 && minute > 15);
      })
      .map(a => ({
        date: a.date,
        checkIn: a.checkIn,
        delay: this.calculateDelay(a.checkIn),
      }));

    // --- Configuration de la réponse HTTP ---
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=rapport_${userId}.pdf`);

    // --- Création du PDF ---
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // ===================== EN-TÊTE =====================
    doc.fontSize(20).fillColor('#0D47A1').text('SOCIÉTÉ FLESK - DÉPARTEMENT RH', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(15).fillColor('black').text('RAPPORT RH COMPLET', { align: 'center' });
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // ===================== INFOS EMPLOYÉ =====================
    doc.fontSize(12).fillColor('black');
    doc.text(
      `Nom : ${user?.nom || 'Inconnu'}    |    ID : ${userId}    |    Date : ${new Date().toLocaleDateString()}`,
      { align: 'left' },
    );
    doc.moveDown(1.5);

    // ===================== DÉTAILS DES CONGÉS =====================
    doc.fontSize(13).fillColor('#0D47A1').text('DÉTAILS DES CONGÉS', { align: 'left' });
    doc.moveDown(0.3);

    if (!leaves.length) {
      doc.fontSize(12).fillColor('red').text('Aucun congé trouvé.');
    } else {
      this.drawTable(doc, ['Début', 'Fin', 'Type', 'Statut'], leaves.map(leave => [
        new Date(leave.startDate).toLocaleDateString('fr-FR'),
        new Date(leave.endDate).toLocaleDateString('fr-FR'),
        leave.type || 'N/A',
        leave.status === 'approved' ? 'APPROUVÉ' :
        leave.status === 'rejected' ? 'REJETÉ' : 'EN ATTENTE'
      ]));
    }

    // ===================== HISTORIQUE DE PRÉSENCE =====================
    doc.fontSize(13).fillColor('#0D47A1').text('HISTORIQUE DE PRÉSENCE', { align: 'left' });
    doc.moveDown(0.3);

    if (!attendance.length) {
      doc.fontSize(12).fillColor('red').text('Aucune présence enregistrée.');
    } else {
      this.drawTable(doc, ['Date', 'Entrée', 'Sortie', 'Heures'],
        attendance.map(a => [
          a.date,
          a.checkIn || '-',
          a.checkOut || '-',
          a.hoursWorked?.toString() || '0'
        ])
      );
    }

    // ===================== HEURES SUPPLÉMENTAIRES =====================
    doc.fontSize(13).fillColor('#0D47A1').text('HEURES SUPPLÉMENTAIRES', { align: 'left' });
    doc.moveDown(0.3);

    if (!overtime.length) {
      doc.fontSize(12).fillColor('red').text('Aucune heure supplémentaire.');
    } else {
      this.drawTable(doc, ['Date', 'Heures'],
        overtime.map(o => [o.date, o.hours.toString()])
      );
    }

    // ===================== RETARDS =====================
    doc.fontSize(13).fillColor('#0D47A1').text('RETARDS', { align: 'left' });
    doc.moveDown(0.3);

    if (!lateArrivals.length) {
      doc.fontSize(12).fillColor('green').text('Aucun retard enregistré.');
    } else {
      this.drawTable(doc, ['Date', 'Heure d\'arrivée', 'Durée du retard'],
        lateArrivals.map(r => [r.date, r.checkIn, r.delay])
      );
    }

    // ===================== PIED DE PAGE =====================
    doc.moveDown(2);
    doc.fontSize(10).fillColor('gray').text(
      'Rapport généré automatiquement par le système GRH - Société Flesk',
      { align: 'center' },
    );

    doc.end(); // ✅ Fin du stream
  }

  // 🔹 Calcul du retard
  private calculateDelay(checkIn: string): string {
    const [hour, minute] = checkIn.split(':').map(Number);
    const workStart = 9 * 60; // 9:00
    const arrival = hour * 60 + minute;
    const diff = arrival - workStart;
    if (diff <= 15) return '0 min';
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h > 0 ? h + 'h ' : ''}${m} min`;
  }

  // 🔹 Dessin d'un tableau
  private drawTable(doc: PDFKit.PDFDocument, headers: string[], rows: string[][]) {
    const startX = 50;
    let startY = doc.y;
    const colWidth = 500 / headers.length;

    // --- En-tête ---
    headers.forEach((header, i) => {
      doc.fontSize(12).fillColor('#0D47A1').text(header, startX + i * colWidth, startY, { width: colWidth, align: 'center' });
    });

    startY += 20;
    doc.moveTo(startX, startY).lineTo(startX + colWidth * headers.length, startY).stroke();

    // --- Lignes
    rows.forEach(row => {
      startY += 20;
      row.forEach((cell, i) => {
        doc.fontSize(11).fillColor('black').text(cell, startX + i * colWidth, startY, { width: colWidth, align: 'center' });
      });
    });

    doc.moveDown(2);
  }
}
