import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { Formation } from 'src/app/core/models/interfaces/formation';
import { FormationService } from 'src/app/core/models/services/formation.service';
import { CoursService } from 'src/app/core/models/services/cours.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

/**
 * List Component
 */
export class ListComponent implements OnInit {
  formations: Formation[] = [];
  formationModalRef?: BsModalRef;
  newFormation: Formation = this.getEmptyFormation();
  searchTerm: string = '';
  selectedFormation: Formation | null = null;
  newCours: { titre: string } = { titre: '' };
  selectedFile: File | null = null;

  @ViewChild('formationModal') formationModal!: TemplateRef<any>;

  constructor(
    private formationService: FormationService,
    private coursService: CoursService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  getEmptyFormation(): Formation {
    return {
      titre: '',
      description: '',
      etat: 'en attente',
      type: ''
    };
  }

  loadFormations(): void {
    this.formationService.getAllFormations().subscribe({
      next: (data) => {
        this.formations = data;
      },
      error: (err) => console.error('Erreur chargement des formations', err)
    });
  }

  openModal(content: TemplateRef<any>, formation?: Formation): void {
    this.newFormation = formation ? { ...formation } : this.getEmptyFormation();
    this.formationModalRef = this.modalService.show(content, {
      class: 'modal-lg modal-dialog-centered'
    });
  }

  saveFormation(): void {
    this.formationService.createFormation(this.newFormation).subscribe({
      next: () => {
        this.loadFormations();
        this.formationModalRef?.hide();
      },
      error: (err) => console.error('Erreur création', err)
    });
  }

  deleteFormation(id: number): void {
    this.formationService.deleteFormation(id).subscribe({
      next: () => this.loadFormations(),
      error: (err) => console.error('Erreur suppression', err)
    });
  }

  acceptFormation(id: number): void {
    const formation = { ...this.formations.find(f => f.id === id)!, etat: 'accepté' };
    this.formationService.updateFormation(id, formation).subscribe({
      next: () => this.loadFormations(),
      error: (err) => console.error('Erreur acceptation', err)
    });
  }

  rejectFormation(id: number): void {
    const formation = { ...this.formations.find(f => f.id === id)!, etat: 'refusé' };
    this.formationService.updateFormation(id, formation).subscribe({
      next: () => this.loadFormations(),
      error: (err) => console.error('Erreur refus', err)
    });
  }

  searchFormations(): void {
    if (this.searchTerm) {
      this.formations = this.formations.filter(f =>
        f.titre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.loadFormations();
    }
  }

  // 👉 Gestion des cours
  selectFormation(formation: Formation): void {
    this.selectedFormation = formation;
    this.loadCours(formation.id!);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) this.selectedFile = file;
  }

  uploadCours(): void {
    if (!this.selectedFormation || !this.selectedFile) return;

    this.coursService.uploadCours(
      this.selectedFile,
      this.selectedFormation.id!,
      this.newCours.titre
    ).subscribe({
      next: (cours) => {
        this.selectedFormation!.cours = [...(this.selectedFormation!.cours || []), cours];
        this.newCours = { titre: '' };
        this.selectedFile = null;
      },
      error: err => console.error('Erreur upload cours', err)
    });
  }

  loadCours(formationId: number): void {
    this.coursService.getCoursByFormation(formationId).subscribe({
      next: (cours) => {
        if (this.selectedFormation) {
          this.selectedFormation.cours = cours;
        }
      },
      error: (err) => console.error('Erreur chargement des cours', err)
    });
  }
}
