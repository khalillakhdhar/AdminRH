import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from 'src/app/core/models/services/user.service';
import { RoleService } from 'src/app/core/models/services/role.service';
import { ServiceService } from 'src/app/core/models/services/service.service';
import { User } from 'src/app/core/models/interfaces/user';
import { Role } from 'src/app/core/models/interfaces/role';
import { Service } from 'src/app/core/models/interfaces/service';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,  // Standalone Component
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot() // ModalModule imported here
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {
  searchTerm: any;
  modalRef?: BsModalRef;
  page: any = 1;
  // bread crumb items
  breadCrumbItems: Array<{}>;
  jobListForm!: NgForm;  // Template-driven form
  submitted: boolean = false;
  endItem: any;
  term: any;
  // Table data
  content?: any;
  lists?: any;
  total: Observable<number>;
  currentPage: any;
  joblist: any;
  searchResults: any;

  constructor(
    private modalService: BsModalService,
    private userService: UserService,
    private roleService: RoleService,
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Jobs' }, { label: 'Jobs List', active: true }];
    // Initialize the lists
    this.loadUsers();
  }

  loadUsers() {
    // This will load users into the list
    this.userService.getAll().subscribe(data => {
      this.lists = data;
      this.joblist = data;
      this.lists = this.joblist.slice(0, 8);
    });
  }

  openModal(content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
  }

  saveUser() {
    if (this.jobListForm.invalid) return;
    const newUser: User = this.jobListForm.value;
    this.userService.create(newUser).subscribe(() => {
      this.loadUsers();
      this.modalService?.hide();
      this.jobListForm.reset();
    });
  }

  openViewModal(content: any) {
    this.modalRef = this.modalService.show(content);
  }

  // Handle delete logic
  delete(event: any) {
    // Handle deletion logic
  }
}
