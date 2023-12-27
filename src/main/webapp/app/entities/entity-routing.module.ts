import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'professor',
        data: { pageTitle: 'profEtudiantApp.professor.home.title' },
        loadChildren: () => import('./professor/professor.routes'),
      },
      {
        path: 'student',
        data: { pageTitle: 'profEtudiantApp.student.home.title' },
        loadChildren: () => import('./student/student.routes'),
      },
      {
        path: 'groupe',
        data: { pageTitle: 'profEtudiantApp.groupe.home.title' },
        loadChildren: () => import('./groupe/groupe.routes'),
      },
      {
        path: 'tooth',
        data: { pageTitle: 'profEtudiantApp.tooth.home.title' },
        loadChildren: () => import('./tooth/tooth.routes'),
      },
      {
        path: 'pw',
        data: { pageTitle: 'profEtudiantApp.pW.home.title' },
        loadChildren: () => import('./pw/pw.routes'),
      },
      {
        path: 'student-pw',
        data: { pageTitle: 'profEtudiantApp.studentPW.home.title' },
        loadChildren: () => import('./student-pw/student-pw.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
