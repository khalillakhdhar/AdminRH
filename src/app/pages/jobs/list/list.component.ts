import { Component, OnInit, ViewChild } from '@angular/core';

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
  @ViewChild('formationModal') formationModal: any;
  
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
      etat: 'en attente', // Par défaut "en attente"
      type: ''
    };
  }

  loadFormations(): void {
    this.formationService.getAllFormations().subscribe(data => {
      this.formations = data;
    });
  }

  openModal(content: any, formation?: Formation): void {
    if (formation) {
      this.newFormation = { ...formation };
    } else {
      this.newFormation = this.getEmptyFormation();
    }
    this.formationModalRef = this.modalService.show(content);
  }

  saveFormation(form: NgForm): void {
    if (form.invalid) return;
    
    if (this.newFormation.id === 0) {
      this.formationService.createFormation(this.newFormation).subscribe(() => {
        this.loadFormations();
        this.formationModalRef?.hide();
        form.resetForm(this.getEmptyFormation());
      });
    } else {
      this.formationService.updateFormation(this.newFormation.id, this.newFormation).subscribe(() => {
        this.loadFormations();
        this.formationModalRef?.hide();
        form.resetForm(this.getEmptyFormation());
      });
    }
  }

  deleteFormation(id: number): void {
    this.formationService.deleteFormation(id).subscribe(() => {
      this.loadFormations();
    });
  }

  acceptFormation(id: number): void {
    const formationToUpdate: Formation = { ...this.formations.find(f => f.id === id)!, etat: 'accepté' };
    this.formationService.updateFormation(id, formationToUpdate).subscribe(() => {
      this.loadFormations();
    });
  }

  rejectFormation(id: number): void {
    const formationToUpdate: Formation = { ...this.formations.find(f => f.id === id)!, etat: 'refusé' };
    this.formationService.updateFormation(id, formationToUpdate).subscribe(() => {
      this.loadFormations();
    });
  }

  searchFormations(): void {
    if (this.searchTerm) {
      this.formations = this.formations.filter(formation =>
        formation.titre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.loadFormations();
    }
  }
}
