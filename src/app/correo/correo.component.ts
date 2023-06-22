import { Component, OnInit } from '@angular/core';
import { AccesoService } from '../servicios/acceso.service';
import { empty, timer } from 'rxjs';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.component.html',
  styleUrls: ['./correo.component.css']
})
export class CorreoComponent implements OnInit {

    focus;
    focus1;
    focus2;
    mensajes:any=[];
    reverso:any;
    mensaje:any;
    idSesion:any=0;
    txt:any='';
    id_administrador:any=0;
    administrador:any;
    departamento:any='Seleccione un departamento';
    nombre:any;
    apellido:any;
    secretaria:any='';
    cobranzas:any='';
    obrasp:any='';
    talentoh:any='';
    comunicacion:any='';
    juridico:any='';
    bandera:number=0;
    hoy:any;
    hora:any;

  constructor(private servicio: AccesoService,
    private router: Router) { }

  ngOnInit(): void {
    //this.mensajes=undefined;
    this.servicio.usuarioId=localStorage.getItem('id')
    this.idSesion=this.servicio.usuarioId;
    if(this.idSesion<1){
      Swal.fire('Inicie sesión');
      this.router.navigateByUrl("login") 
    }else{
      this.observableTimer();
    }
  }

  addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }

  fechajs(){
    const currentDate = new Date();

    const currentDayOfMonth = currentDate.getDate();
    const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
    const currentYear = currentDate.getFullYear();
    const currentHour =  this.addZero(currentDate.getHours());
    const currentMinutes = this.addZero(currentDate.getMinutes());

    this.hoy = currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear;
    this.servicio.fecha=this.hoy;
    this.hora = currentHour +':'+ currentMinutes;
    this.servicio.hora=this.hora;
    console.log(this.hoy +' '+ this.hora);
  }

  observableTimer() {
    const source = timer(1000, 5000);
    this.servicio.subscription = source.subscribe(val => {
      console.log(val, '-');
      if(this.bandera==1){
        this.botons();
      }else if(this.bandera==2){
        this.botonc();
      }else if(this.bandera==3){
        this.botono();
      }else if(this.bandera==4){
        this.botont();
      }else if(this.bandera==5){
        this.botonco();
      }else if(this.bandera==6){
        this.botonj();
      }else if(this.bandera==0){
        this.departamento='Seleccione un departamento'
      }
    });
  }

  pausar(){
    this.servicio.subscription.unsubscribe();
  }

  cargarTabla(){
    let body={
      'accion': 'consultar_mensajes',
      'id_usuario': this.servicio.usuarioId,
      'id_empleado': this.id_administrador
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.mensajes=res.datos;
          this.reverso=this.mensajes.reverse();
        }else{
          this.reverso=[];
        }
      });
    });
  }

  consularAdministrador(){
    let body={
      'accion': 'consultar_administrador',
      'departamento': this.departamento
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.administrador=res.datos;
          this.apellido=this.administrador[0].apellido;
          this.nombre=this.administrador[0].nombre;
          this.id_administrador=this.administrador[0].id_empleado;
          this.cargarTabla();
        }else{
          this.bandera=0;
          this.reverso=[];
          Swal.fire('Error','No se puede enviar mensajes a este departamento por el momento','error');
        }
      });
    });
  }

  guardarMensaje(){
    this.fechajs();
      if(this.txt==''){
        Swal.fire('Error','Ingrese un mensaje','error');
      }else if(this.id_administrador==0){
        Swal.fire('Error','Seleccione un departamento antes de enviar mensajes','error');
      }else{
        let body={
          'accion':'guardar_mensaje',
          'id_empleado': this.id_administrador,
          'id_usuario': this.servicio.usuarioId,
          'remitente':'usuario',
          'mensaje':this.txt,
          'fecha': this.hoy,
          'hora': this.hora
        }
        console.log(body);
          return new Promise(resolve=>{
          this.servicio.postData(body).subscribe((res:any)=>{
            this.mensaje=res;
            if(res.estado){
            this.cargarTabla();
            this.txt='';
            }else{
                Swal.fire('Error','Error','error');
            }
          }, (err)=>{
            //Error
            console.log(err);
            Swal.fire('Error','Error de conexión','error');
          });
        });
      }
  }

  botons(){
    this.bandera=1;
    //this.mensajes=undefined;
    this.departamento='SECRETARIA';
    this.consularAdministrador();
  }
  botonc(){
    this.bandera=2;
    //this.mensajes=undefined;
    this.departamento='COBRANZAS';
    this.consularAdministrador();
  }
  botono(){
    this.bandera=3;
    //this.mensajes=undefined;
    this.departamento='OBRAS PUBLICAS';
    this.consularAdministrador();
  }
  botont(){
    this.bandera=4;
    //this.mensajes=undefined;
    this.departamento='TALENTO HUMANO';
    this.consularAdministrador();
  }
  botonco(){
    this.bandera=5;
    //this.mensajes=undefined;
    this.departamento='COMUNICACION';
    this.consularAdministrador();
  }
  botonj(){
    this.bandera=6;
    //this.mensajes=undefined;
    this.departamento='JURIDICO';
    this.consularAdministrador();
  }
}