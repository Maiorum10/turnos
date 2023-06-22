import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AccesoService } from '../servicios/acceso.service';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels} from '@techiediaries/ngx-qrcode';

@Component({
  selector: 'app-turno',
  templateUrl: './turno.component.html',
  styleUrls: ['./turno.component.css']
})
export class TurnoComponent implements OnInit {

  focus;
  focus1;
  focus2;
  nombre:any;
  apellido:any;
  cedula:any;
  fecha:any;
  departamento:any;
  numero:any;
  elementType = 'url';
  value = '';

  constructor(private servicio: AccesoService,
    private router: Router) { }

  ngOnInit(): void {
    if(this.servicio.subscription==undefined){
      
    }else{
      this.pausar();
    }
    this.nombre=this.servicio.nombre;
    this.apellido=this.servicio.apellido;
    this.cedula=this.servicio.cedula;
    this.fecha=this.servicio.fecha;
    this.departamento=this.servicio.departamento;
    this.numero=this.servicio.numero;
    document.getElementById('botones').style.display = 'block';

    this.value=this.nombre +' '+ this.apellido +' cedula: '+ this.cedula
    +' turno: '+ this.numero +' fecha: '+ this.fecha +' departmaneto: '+ this.departamento;
  }

  pausar(){
    this.servicio.subscription.unsubscribe();
    this.servicio.subscription=undefined;
  }

  pdf(){
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a5');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', -35, position, fileWidth, fileHeight);
      PDF.save('turno.pdf');
      this.router.navigateByUrl("home") 
    });
  }

  guardar(){
    document.getElementById('botones').style.display = 'none';
    this.pdf();
  }

}
