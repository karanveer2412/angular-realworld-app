import { Component, DestroyRef, inject, Input } from "@angular/core";
import { ArticlesService } from "../services/articles.service";
import { ArticleListConfig } from "../models/article-list-config.model";
import { Article } from "../models/article.model";
import { ArticlePreviewComponent } from "./article-preview.component";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { LoadingState } from "../../../core/models/loading-state.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { FormsModule } from "@angular/forms";

interface Comment {
  text: string;
}
@Component({
  selector: "app-article-list",
  templateUrl: "article-list.component.html",
  imports: [ArticlePreviewComponent, NgForOf, NgClass, NgIf, FormsModule],
  styles: `
    .page-link {
      cursor: pointer;
    }
  `,
  standalone: true,
})
export class ArticleListComponent {
  query!: ArticleListConfig;
  results: Article[] = [];
  currentPage = 1;
  totalPages: Array<number> = [];
  loading = LoadingState.NOT_LOADED;
  LoadingState = LoadingState;
  destroyRef = inject(DestroyRef);
  loaderText = "Loader text is present here...";
  comment = "";
  comments: Array<String> = [];

  @Input() limit!: number;
  @Input()
  set config(config: ArticleListConfig) {
    if (config) {
      this.query = config;
      this.currentPage = 1;
      this.runQuery();
    }
  }

  constructor(private articlesService: ArticlesService) {}

  setPageTo(pageNumber: number) {
    this.currentPage = pageNumber;
    this.runQuery();
  }

  saveText(): void {
    if (this.comment.trim()) {
      this.comments.push(this.comment);
      this.comment = "";
    }
  }

  // saveText(): void {
  //   if (this.comment.trim()) {
  //     this.comments.push(this.comment);
  //     this.comment = "";
  //   }
  // }

  // saveText(): void {
  //   if (this.comment.trim()) {
  //     this.comments.push(this.comment);
  //     this.comment = "";
  //   }
  // }
  clicked() {
    this.loaderText = "text changed loading";
  }

  runQuery() {
    this.loading = LoadingState.LOADING;
    this.results = [];

    // Create limit and offset filter (if necessary)
    if (this.limit) {
      this.query.filters.limit = this.limit;
      this.query.filters.offset = this.limit * (this.currentPage - 1);
    }

    this.articlesService
      .query(this.query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.loading = LoadingState.LOADED;
        this.results = data.articles;

        // Used from http://www.jstips.co/en/create-range-0...n-easily-using-one-line/
        this.totalPages = Array.from(
          new Array(Math.ceil(data.articlesCount / this.limit)),
          (val, index) => index + 1,
        );
      });
  }

  // runQuery() {
  //   this.loading = LoadingState.LOADING;
  //   this.results = [];

  //   // Create limit and offset filter (if necessary)
  //   if (this.limit) {
  //     this.query.filters.limit = this.limit;
  //     this.query.filters.offset = this.limit * (this.currentPage - 1);
  //   }

  //   this.articlesService
  //     .query(this.query)
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe((data) => {
  //       this.loading = LoadingState.LOADED;
  //       this.results = data.articles;

  //       // Used from http://www.jstips.co/en/create-range-0...n-easily-using-one-line/
  //       this.totalPages = Array.from(
  //         new Array(Math.ceil(data.articlesCount / this.limit)),
  //         (val, index) => index + 1,
  //       );
  //     });
  // }
}
