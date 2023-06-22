import { Component, OnInit } from '@angular/core';
import { AccesoService } from '../servicios/acceso.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit {
  focus: any;
  focus1: any;

  constructor(private servicio: AccesoService,
    private router: Router) { }

    ngOnInit(): void {
      this.verificar();
  }

  verificar(){
    if(this.servicio.usuarioId=='0'){
        this.router.navigateByUrl("login") 
    }else{
        this.router.navigateByUrl("landing") 
    }
}
}
