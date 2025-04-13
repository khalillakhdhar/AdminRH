import { Component, OnInit } from '@angular/core';
import { Fourniture } from 'src/app/core/models/interfaces/fourniture';
import { TypeFourniture } from 'src/app/core/models/interfaces/type-fourniture';
import { Matiere } from 'src/app/core/models/interfaces/matiere';
import { MatiereService } from 'src/app/core/models/services/matiere.service';
import { TypeFournitureService } from 'src/app/core/models/services/type-fourniture.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
  standalone: true,
   imports: [
    // Ajoutez ici les modules Angular nécessaires
    FormsModule,
    CommonModule
  ]
})
export class DefaultComponent implements OnInit {
  currentUser: any = null;

  // Matières & Types CRUD
  matieres: Matiere[] = [];
  typesFourniture: TypeFourniture[] = [];

  newMatiere: Matiere = { id: 0, nom: '', quantite: 0, dateAjout: '' };
  newType: TypeFourniture = { id: 0, nom: '', qte: '' };

  constructor(
    private matiereService: MatiereService,
    private typeService: TypeFournitureService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('currentUser');
    this.currentUser = user ? JSON.parse(user) : null;

    this.getMatieres();
    this.getTypes();
  }

  // 🔁 MATERIELS
  getMatieres() {
    this.matiereService.getAll().subscribe(data => this.matieres = data);
  }

  addMatiere(form: any) {
    if (form.valid) {
      this.matiereService.create(this.newMatiere).subscribe(() => {
        this.getMatieres();
        this.newMatiere = { id: 0, nom: '', quantite: 0, dateAjout: '' };
        form.resetForm();
      });
    }
  }

  deleteMatiere(id: number) {
    this.matiereService.delete(id).subscribe(() => this.getMatieres());
  }

  // 🔁 TYPES
  getTypes() {
    this.typeService.getAll().subscribe(data => this.typesFourniture = data);
  }

  addType(form: any) {
    if (form.valid) {
      this.typeService.create(this.newType).subscribe(() => {
        this.getTypes();
        this.newType = { id: 0, nom: '', qte: '' };
        form.resetForm();
      });
    }
  }

  deleteType(id: number) {
    this.typeService.delete(id).subscribe(() => this.getTypes());
  }
}
