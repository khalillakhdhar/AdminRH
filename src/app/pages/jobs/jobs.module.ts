import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {JobsRoutingModule} from "./jobs-routing.module";
import { ListComponent } from './list/list.component';
import { GridComponent } from './grid/grid.component';
import { ApplyComponent } from './apply/apply.component';
import { DetailsComponent } from './details/details.component';
import { CategoriesComponent } from './categories/categories.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { CandidateOverviewComponent } from './candidate-overview/candidate-overview.component';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    ListComponent,
    GridComponent,
    ApplyComponent,
    DetailsComponent,
    CategoriesComponent,
    CandidateListComponent,
    CandidateOverviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    JobsRoutingModule,
    PagetitleComponent,
    ModalModule.forRoot()
  ]
})

export class JobsModule { }
