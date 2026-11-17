import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MarcaService } from '../../../core/services/marca.service';
import { MarcaCadastro } from '../../../core/models/marca.model';

@Component({
  selector: 'app-marca-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, ToastModule, InputTextModule, ButtonModule],
  providers: [MessageService],
  templateUrl: './marca-cadastro.component.html',
  styleUrl: './marca-cadastro.component.css'
})
export class MarcaCadastroComponent {
  private fb = inject(FormBuilder);
  private marcaService = inject(MarcaService);
  private messageService = inject(MessageService);

  enviando = false;

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    cnpj: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]]
  });

  enviar(): void {
    if (this.form.invalid || this.enviando) {
      this.form.markAllAsTouched();
      return;
    }

    // Trim antes do envio (regra 5.4.2)
    const payload: MarcaCadastro = {
      nome: (this.form.value.nome ?? '').trim(),
      cnpj: (this.form.value.cnpj ?? '').trim()
    };

    this.enviando = true;
    this.marcaService.inserir(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Marca "${payload.nome}" cadastrada!`
        });
        this.form.reset();
        this.enviando = false;
      },
      error: (erro) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: erro?.error?.message ?? 'Não foi possível cadastrar a marca. Verifique a conexão com o backend.'
        });
        this.enviando = false;
      }
    });
  }

  erroNome(): boolean {
    const c = this.form.controls.nome;
    return c.invalid && (c.touched || c.dirty);
  }

  erroCnpj(): boolean {
    const c = this.form.controls.cnpj;
    return c.invalid && (c.touched || c.dirty);
  }
}   