import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormationService } from 'src/app/core/models/services/formation.service';
import { QuizService } from 'src/app/core/models/services/quiz.service';
import { QuizQuestionService } from 'src/app/core/models/services/quiz-question.service';
import { Formation } from 'src/app/core/models/interfaces/formation';
import { Quiz } from 'src/app/core/models/interfaces/quiz.model';
import { QuizQuestion } from 'src/app/core/models/interfaces/question.model';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ]
})
export class GridComponent implements OnInit {
  formations: Formation[] = [];
  quizzes: Quiz[] = [];
  quizQuestions: QuizQuestion[] = [];
  selectedQuiz: Quiz | null = null;

  currentQuestionIndex = 0;
  userAnswers: { [questionId: number]: number } = {};
  score: number | null = null;
  pointsPerQuestion = 20; // ou ce que tu souhaites comme barème

  quizModalRef?: BsModalRef;

  @ViewChild('quizModal') quizModal!: TemplateRef<any>;

  currentUser = JSON.parse(localStorage.getItem('currentUser')!); // adapte en fonction

  constructor(
    private formationService: FormationService,
    private quizService: QuizService,
    private quizQuestionService: QuizQuestionService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations() {
    this.formationService.getAllFormations().subscribe({
      next: (data) => (this.formations = data),
      error: (err) => console.error(err),
    });
  }

  openQuizForFormation(formation: Formation) {
    this.score = null;
    this.quizQuestions = [];
    this.selectedQuiz = null;
    this.currentQuestionIndex = 0;
    this.userAnswers = {};

    // Charger le quiz de la formation (ici on prend le 1er quiz pour simplifier)
    this.quizService.getQuizsByFormation(formation.id!).subscribe({
      next: (quizzes) => {
        if (quizzes.length > 0) {
          this.selectedQuiz = quizzes[0]; // adapter si plusieurs quizzes par formation
          this.loadQuizQuestions(this.selectedQuiz.id!);
          this.quizModalRef = this.modalService.show(this.quizModal, {
            class: 'modal-lg modal-dialog-centered',
          });
        } else {
          alert('Aucun quiz disponible pour cette formation.');
        }
      },
      error: (err) => console.error(err),
    });
  }

  loadQuizQuestions(quizId: number) {
    this.quizQuestionService.getQuestionsByQuiz(quizId).subscribe({
      next: (questions) => {
        this.quizQuestions = questions;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
      },
      error: (err) => console.error(err),
    });
  }

  selectOption(questionId: number, optionId: number) {
    this.userAnswers[questionId] = optionId;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.quizQuestions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitQuiz() {
    if (!this.selectedQuiz || !this.currentUser) return alert('Quiz ou utilisateur non défini.');

    const answers = Object.entries(this.userAnswers).map(([questionId, optionId]) => ({
      questionId: +questionId,
      optionId,
    }));

    this.quizService.submitQuiz(this.selectedQuiz.id!, this.currentUser.id, { answers }).subscribe({
      next: (res) => {
        this.score = res.score;
      },
      error: (err) => console.error('Erreur lors de la soumission du quiz', err),
    });
  }
}
