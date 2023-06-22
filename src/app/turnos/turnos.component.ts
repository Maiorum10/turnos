import { Component, OnInit } from '@angular/core';
import { AccesoService } from '../servicios/acceso.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {

  focus;
  focus1;
  focus2;
  usuario:any;
  nombre:any;
  apellido:any;
  cedula:any;
  fecha:any;
  departmaneto:any;
  numero:any;
  turnos:any=[];

  constructor(private servicio: AccesoService,
    private router: Router) { }

  ngOnInit(): void {
    this.consultarUsuario();
    this.cargarTabla();
    if(this.servicio.subscription==undefined){
      
    }else{
      this.pausar();
    }
  }

  consultarUsuario(){
    let body={
      'accion': 'consultar_uturnos',
      'id_usuario': this.servicio.usuarioId
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.usuario=res.datos;
          this.nombre = this.usuario[0].nombre;
          this.apellido = this.usuario[0].apellido;
        }else{
          Swal.fire('No existe el usuario');
        }
      }, (err)=>{
        Swal.fire('Error','Error de conexión','error');
      });
    });
  }

  pausar(){
    this.servicio.subscription.unsubscribe();
    this.servicio.subscription=undefined;
  }

  removeId(tr){
    this.servicio.nombre=tr.nombre;
    this.servicio.apellido=tr.apellido;
    this.servicio.cedula=tr.cedula;
    this.servicio.fecha=tr.fecha;
    this.servicio.departamento=tr.departamento;
    this.servicio.numero=tr.numero;
    this.router.navigateByUrl("turno");
  }

  cargarTabla(){
    let body={
      'accion': 'consultar_turnos',
      'cedula': this.servicio.cedulaSesion
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.turnos=res.datos;
        }else{
          this.turnos=[];
        }
      });
    });
  }

}
