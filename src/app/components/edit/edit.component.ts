import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project'
import { ProjectService } from '../../services/project.service'
import { UploadService } from '../../services/upload.service';
import { Global } from '../../services/global';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: '../create/create.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [ProjectService, UploadService]
})
export class EditComponent implements OnInit {
  public title: string;
  public project: Project;
  public status : string;
  public filesToUpload:Array<File>;
  public url: string;
  public save_project;

  constructor(
    private _projectService: ProjectService,
    private _uploadService: UploadService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { 
    this.title = "Actualizar Proyecto";
    this.url = Global.url;
  }

  ngOnInit() {
    this._route.params.subscribe (params =>{
              let id = params.id;

              this.getProject(id)
    });
  }

  getProject(id){
    this._projectService.getProject(id).subscribe(
      response => {
          this.project = response.project
          console.log(response);
      },
      error => {
        console.log(<any>error);
      });
    }
    onSubmit(form) {
      //guardar datos basicos
      this._projectService.updateProject(this.project).subscribe(
        response => {
    
           if (response.project){
             if(this.filesToUpload){

              this._uploadService.makeFileRequest(this.url+"upload-image/"+response.project._id, [], this.filesToUpload, 'image')
              .then((result:any) =>{
                      
                this.save_project = result.project;
                this.status = 'success';
                    
               });
             }else{
              this.save_project = response.project;
              this.status = 'success';
              form.reset();
             }
             
          }else{
           this.status = 'failed';
          }
        },
        error => {
          console.log(<any>error);
        }
        
      );
    }

    fileChangeEvent(fileInput:any){
      console.log(fileInput);
       this.filesToUpload = <Array<File>>fileInput.target.files;
      }

}
