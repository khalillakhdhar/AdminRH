import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { Formation } from 'src/app/core/models/interfaces/formation';
import { FormationService } from 'src/app/core/models/services/formation.service';
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
  @ViewChild('formationModal') formationModal!: TemplateRef<any>;

  constructor(
    private formationService: FormationService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  getEmptyFormation(): Formation {
    return {
      id: 0,
      titre: '',
      description: '',
      date_creation: new Date().toISOString(),
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
  saveFormation(form: NgForm): void {
    if (form.invalid) return;

    if (this.newFormation.id === 0) {
      // Création
      this.formationService.createFormation(this.newFormation).subscribe({
        next: () => {
          this.loadFormations();
          this.formationModalRef?.hide();
          form.resetForm(this.getEmptyFormation());
        },
        error: (err) => {
          console.error('Erreur lors de la création de la formation', err);
        }
      });
    } else {
      // Mise à jour
      this.formationService.updateFormation(this.newFormation.id, this.newFormation).subscribe({
        next: () => {
          this.loadFormations();
          this.formationModalRef?.hide();
          form.resetForm(this.getEmptyFormation());
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la formation', err);
        }
      });
    }
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
}
