import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './grupos.component.html',
  styleUrl: './grupos.component.css'
})
export class GruposComponent {
  groups: any[] = [];// Lista de Grupos
  groupDetails: any; // Detalhes dos Grupos
  isLoading = false; // Para travar a tela caso tenha alguma requisição
  error: string | null = null; // Demonstrar o erro
  lastGroupFetch: number = -1; // Ultimo grupo que foi pego os detalhes, facilitando inserir pessoas no grupo
  userName:string = ""; // Nomes da pessoas
  receiverVisibility: boolean[] = []; // Na lista de sorteio, os recebedores do presente são escondidos e só aparecem caso escolhidos

  constructor(private apiService: ApiService) { this.fetchGroups();}

  // Pegar todos os grupos
  fetchGroups() {
    this.isLoading = true;
    this.apiService.getGroups().subscribe({
      next: (response) => {
        this.groups = response;
        this.isLoading = false;
        this.error = null;
      },
      error: (err) => {
        if (err.error && err.error.error) {
          this.error = `Erro em Pegar os grupos, Erro: ${err.error.error}`;
        } else {
          this.error = `Erro em Pegar os grupo, Erro: ${err.message || err.statusText || 'Erro Desconhecido'}`;
        }
        this.isLoading = false;
      },
    });
  }

  // Pegar as informações do grupo
  fetchGroupDetails(id: number, manterErro:boolean = false) {
    if (id == -1){
      this.groupDetails = null;
    }
    this.isLoading = true;
    this.lastGroupFetch = id;
    this.apiService.getGroupById(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.groupDetails = response;
        if (this.groupDetails.drawResults){
          this.shuffleArray(this.groupDetails.drawResults);
        }
        if(!manterErro){
          this.error = null;
        }
        this.receiverVisibility = [];
      },
      error: (err) => {
        if (err.error && err.error.error) {
          this.error = `Erro em Pegar as informações do grupo, Erro: ${err.error.error}`;
        } else {
          this.error = `Erro em Pegar as informações do grupo, Erro: ${err.message || err.statusText || 'Erro Desconhecido'}`;
        }
        this.isLoading = false;
      },
    });
  }

  // Criar um group
  createGroup(inputElement: HTMLInputElement): void {
    const name_group = inputElement.value;
    this.isLoading = true;
    if (name_group.trim()){
      this.apiService.createGroup({name_group}).subscribe({
        next: () => {
          this.isLoading = false;
          this.error = null;
          this.fetchGroups();
          inputElement.value = '';
        },
        error: (err) => {
          if (err.error && err.error.error) {
            this.error = `Erro em Criar o grupo, ${err.error.error}`;
          } else {
            this.error = `Erro em Criar o grupo, Erro: ${err.message || err.statusText || 'Erro Desconhecido'}`;
          }
          this.isLoading = false;
          inputElement.value = '';
        },
      });
    } else {
      this.error = `Nome do Grupo não pode ser vazio`;
      this.isLoading=false;
    }
  }

  // Deletar um group
  deleteGroup(id: number) {
    const confirmar = window.confirm('Você tem certeza que quer deletar esse grupo?');
    if (confirmar) {
      this.isLoading = true;
      this.apiService.deleteGroup(id).subscribe({
        next: () => {
          this.isLoading = false;
          this.fetchGroups();
          if (this.lastGroupFetch == id){
            this.fetchGroupDetails(-1);
          }
          this.error = null;
        },
        error: (err) => {
          if (err.error && err.error.error) {
            this.error = `Erro em Deletar o grupo, ${err.error.error}`;
          } else {
            this.error = `Erro em Deletar o grupo, Erro: ${err.message || err.statusText || 'Erro Desconhecido'}`;
          }
          this.isLoading = false;
        },
      });
    }
  }

  // Adicionar um participante a um grupo
  addParticipant(groupId: number, userName: string) {
    this.isLoading = true;
    if (userName.trim() !== '') {
      this.apiService.addParticipantToGroup(groupId, userName).subscribe({
        next: () => {
          this.isLoading = false;
          this.fetchGroupDetails(groupId);
          this.userName = '';
          this.error = null;
        },
        error: (err) => {
          if (err.error && err.error.error) {
            this.error = `Erro em adicionar participante, ${err.error.error}`;
          } else {
            this.error = `Erro em adicionar participante, Erro: ${
              err.message || err.statusText || 'Erro Desconhecido'
            }`;
          }
          this.isLoading = false;
        },
      });
    } else {
      this.error = 'Nome precisa de pelo menos um caracter';
      this.isLoading = false;
    }
  }

  // Remover um participante de um grupo
  RemoveUserGroup(groupId:number,userId:number): void{
    const confirmar = window.confirm('Você tem certeza que quer Remover o jogador desse grupo?');
    if (confirmar){
      this.isLoading = true;
      this.apiService.removeParticipantToGroup(groupId,userId).subscribe({
        next:() => {
          this.isLoading = false;
          this.fetchGroups();
          this.fetchGroupDetails(groupId);
          this.error = null;
        },
        error:(err)=>{
          if (err.error && err.error.error) {
            this.error = `Erro em Remover o usuário, ${err.error.error}`;
          } else {
            this.error = `Erro em Remover o usuário, Erro: ${err.message || err.statusText || 'Erro Desconhecido'}`;
          }
          this.isLoading = false;
        },
      })
    }
  }


  // Sortear o grupo selecionado
  generateDraw(groupId:number): void {
    let confirmar = true;
    if(this.groupDetails.sorteioOccurred){
      confirmar = false;
      confirmar = window.confirm('Você tem certeza que quer Refazer o sorteio?');
    }
    if (confirmar){
      this.isLoading = true;
      this.apiService.generateDraw(groupId).subscribe({
        next:() => {
          this.fetchGroups();
          this.fetchGroupDetails(groupId)
          this.isLoading = false;
          this.error = null;
        },
        error:(err)=>{
          if (err.error && err.error.error) {
            this.error = `Erro em Sortear o grupo, ${err.error.error}`;
            this.fetchGroupDetails(groupId,true);
          } else {
            this.error = `Erro em Sortear o grupo, Erro: ${err.message || err.statusText || 'Erro Desconhecido'}`;
            this.fetchGroupDetails(groupId,true);
          }
          this.isLoading = false;
        },
      });
    }
  }

  //Ao demonstrar as pessoas tiradas, aleatoriaza o array para que a demonstração não seja seguida;
  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  //Ativar e desativar a visulização do recebedor do presente
  toggleReceiverName(index: number): void {
    this.receiverVisibility[index] = !this.receiverVisibility[index];
  }

  //Array para saber se os recebedor do presente está visivel ou não
  isReceiverVisible(index: number): boolean {
    return this.receiverVisibility[index];
  }
}
