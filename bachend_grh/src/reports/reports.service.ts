import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as PDFDocument from 'pdfkit';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

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

  async generateFullReport(userId: string): Promise<string> {
    // 📂 Crée le dossier reports s'il n'existe pas
    const reportsDir = join(__dirname, '../../reports');
    if (!existsSync(reportsDir)) mkdirSync(reportsDir);

    // 📄 Nom du fichier PDF
    const filePath = join(reportsDir, `full_report_${userId}_${Date.now()}.pdf`);

    // 📊 Récupération des données
    const user = await this.userModel.findById(userId).lean();
    const leaves = await this.leaveModel.find({ userId }).sort({ startDate: 1 }).lean();
    const attendance = await this.attendanceModel.find({ userId }).sort({ date: 1 }).lean();
    const overtime = await this.overtimeModel.find({ userId }).sort({ date: 1 }).lean();

    // 🖨️ Création du PDF
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(createWriteStream(filePath));

    // --- EN-TÊTE ---
    doc.fontSize(22).fillColor('#0D47A1').text('Société Flesk - Département RH', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(16).fillColor('black').text('Rapport RH Complet', { align: 'center' });
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // --- INFOS EMPLOYÉ ---
    doc.fontSize(12).fillColor('black');
    doc.text(`Nom de l'employé : ${user?.nom || 'Inconnu'}`);
    doc.text(`ID Employé       : ${userId}`);
    doc.text(`Date du rapport  : ${new Date().toLocaleDateString()}`);
    doc.moveDown(1);

    // ======================================================
    // 1️⃣ TABLEAU DES CONGÉS
    // ======================================================
    doc.fontSize(14).fillColor('black').text('Détails des congés :');
    doc.moveDown(0.5);

    if (!leaves.length) {
      doc.fontSize(12).fillColor('red').text('Aucun congé trouvé.');
    } else {
      this.drawTable(doc, ['Début', 'Fin', 'Type', 'Statut'], leaves.map(leave => [
        new Date(leave.startDate).toLocaleDateString(),
        new Date(leave.endDate).toLocaleDateString(),
        leave.type || 'N/A',
        leave.status === 'approved' ? '✅ APPROVED' :
        leave.status === 'rejected' ? '❌ REJECTED' : '⏳ PENDING'
      ]));
    }

    doc.moveDown(1);

    // ======================================================
    // 2️⃣ HISTORIQUE DES PRÉSENCES
    // ======================================================
    doc.fontSize(14).fillColor('black').text('Historique de présence :');
    doc.moveDown(0.5);

    if (!attendance.length) {
      doc.fontSize(12).fillColor('red').text('Aucune présence enregistrée.');
    } else {
      this.drawTable(doc, ['Date', 'Check-in', 'Check-out', 'Heures'],
        attendance.map(a => [
          a.date,
          a.checkIn || '-',
          a.checkOut || '-',
          a.hoursWorked?.toString() || '0'
        ])
      );
    }

    doc.moveDown(1);

    // ======================================================
    // 3️⃣ HEURES SUPPLÉMENTAIRES
    // ======================================================
    doc.fontSize(14).fillColor('black').text('Heures supplémentaires :');
    doc.moveDown(0.5);

    if (!overtime.length) {
      doc.fontSize(12).fillColor('red').text('Aucune heure supplémentaire.');
    } else {
      this.drawTable(doc, ['Date', 'Heures Supplémentaires'],
        overtime.map(o => [o.date, o.hours.toString()])
      );
    }

    // --- PIED DE PAGE ---
    doc.moveDown(2);
    doc.fontSize(10).fillColor('gray').text(
      'Rapport généré automatiquement par le système GRH - Société Flesk',
      { align: 'center' },
    );

    // ✅ Finalisation
    doc.end();
    return filePath;
  }

  // ======================================================
  // 🔹 Méthode pour dessiner un tableau aligné
  // ======================================================
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
