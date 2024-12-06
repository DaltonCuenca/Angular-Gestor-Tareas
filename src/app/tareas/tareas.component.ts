import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Tarea {
  id?: number;
  descripcion: string;
  fecha: Date | string;
  estado: string;
}

interface TareaFormValid {
  descripcion: boolean;
  fecha: boolean;
}

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.scss'
})
export class TareasComponent {
  listaDatos: Tarea[] = [];
  listaFiltros: Tarea[] = [];
  verModal: boolean = false;
  isEditando: boolean = false;
  modalTarea: Tarea = this.inicializarTarea();
  tareaOriginal: Tarea | null = null;
  verModalConfirmacion: boolean = false;
  tareaFormValid: TareaFormValid = {
    descripcion: false,
    fecha: false
  };

  hasErrors: boolean = false;
  filtroDescripcion: string = '';
  filtroFecha: string = '';
  filtroEstado: string = '';

  private inicializarTarea(): Tarea {
    return {
      descripcion: '',
      fecha: '',
      estado: 'pendiente'
    };
  }

  aplicarFiltros() {
    console.log(this.filtroDescripcion, this.filtroFecha, this.filtroEstado);
    this.listaFiltros = this.listaDatos.filter(tarea => {
      const cumpleDescripcion = !this.filtroDescripcion ||
        tarea.descripcion.toLowerCase().includes(this.filtroDescripcion.toLowerCase());

      const cumpleFecha = !this.filtroFecha || this.compararFechas(tarea.fecha, this.filtroFecha);

      const cumpleEstado = !this.filtroEstado ||
        tarea.estado === this.filtroEstado || this.filtroEstado === '';

      return cumpleDescripcion && cumpleFecha && cumpleEstado;
    });
  }

  private compararFechas(fecha1: Date | string, fecha2: string): boolean {
    const fecha1Str = fecha1 instanceof Date 
      ? fecha1.toISOString().split('T')[0] 
      : fecha1.toString().split('T')[0];
    return fecha1Str === fecha2;
  }

  editarTarea(tarea: Tarea) {
    this.isEditando = true;
    this.tareaOriginal = tarea;
    this.modalTarea = { ...tarea };
    this.verModal = true;
  }

  guardarTarea() {
    if (this.isEditando) {
      const index = this.listaDatos.findIndex(t => t === this.tareaOriginal);
      if (index !== -1) {
        this.listaDatos[index] = { ...this.modalTarea };
      }
    } else {
      // resetear validaciones
      this.tareaFormValid = {
        descripcion: false,
        fecha: false
      }

      //validar descripcion
      this.tareaFormValid.descripcion = this.modalTarea.descripcion.trim() !== '';
      // validar fecha
      this.tareaFormValid.fecha = this.modalTarea.fecha != null && this.modalTarea.fecha !== '';

      // validar formulario
      this.hasErrors = !Object.values(this.tareaFormValid).every(Boolean);
      console.log(this.modalTarea);
      
      if (this.hasErrors) return;

      const fechaDate = new Date(this.modalTarea.fecha);
      this.modalTarea.fecha = fechaDate;

      this.listaDatos.push({ ...this.modalTarea });
    }
    this.aplicarFiltros();
    this.cerrarModal();
  }

  abrirModal() {
    this.isEditando = false;
    this.modalTarea = this.inicializarTarea();
    this.verModal = true;
  }

  cerrarModal() {
    this.verModal = false;
    this.isEditando = false;
    this.modalTarea = this.inicializarTarea();
    this.hasErrors = false;
    this.tareaFormValid = {
      descripcion: false,
      fecha: false
    }
  }

  eliminarTarea(tarea: Tarea) {
    this.verModalConfirmacion = true;
    this.tareaOriginal = tarea;
  }

  eliminarTareaConfirmacion(confirmacion: boolean) {
    if (confirmacion) {
      this.listaDatos = this.listaDatos.filter(t => t !== this.tareaOriginal);
      this.aplicarFiltros();
    }
    this.verModalConfirmacion = false;
  }
}
