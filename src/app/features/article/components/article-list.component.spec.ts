// article-list.component.spec.ts
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ArticleListComponent } from "./article-list.component";
import { ArticlesService } from "../services/articles.service";
import { of, throwError } from "rxjs";
import { LoadingState } from "../../../core/models/loading-state.model";
import { Article } from "../models/article.model";
import { DestroyRef } from "@angular/core";

// Mock ArticlesService with both positive and error response
class MockArticlesService {
  query(config: any) {
    // Default implementation can be an empty successful response
    return of({ articles: [], articlesCount: 0 });
  }
}

describe("ArticleListComponent", () => {
  let component: ArticleListComponent;
  let fixture: ComponentFixture<ArticleListComponent>;
  let articlesService: ArticlesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleListComponent],
      providers: [
        { provide: ArticlesService, useClass: MockArticlesService },
        DestroyRef,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleListComponent);
    component = fixture.componentInstance;
    articlesService = TestBed.inject(ArticlesService);
    fixture.detectChanges();
  });

  it("should initialize with default values", () => {
    expect(component.currentPage).toBe(1);
    expect(component.loading).toBe(LoadingState.NOT_LOADED);
    expect(component.results.length).toBe(0);
  });

  it("should run query when config is set", () => {
    spyOn(component, "runQuery");
    component.config = { type: "all", filters: {} };
    expect(component.runQuery).toHaveBeenCalled();
  });

  it("should update results on successful data fetch", () => {
    const mockArticles: Article[] = [{ title: "Test Article" } as Article];
    spyOn(articlesService, "query").and.returnValue(
      of({ articles: mockArticles, articlesCount: 1 }),
    );
    component.runQuery();
    expect(component.results).toEqual(mockArticles);
    expect(component.loading).toBe(LoadingState.LOADED);
  });

  it("should handle errors during data fetch gracefully", () => {
    spyOn(articlesService, "query").and.returnValue(
      throwError(() => new Error("An error occurred")),
    );
    component.runQuery();
    // Depending on implementation, check if error state is handled (e.g., showing an error message)
    expect(component.loading).toBe(LoadingState.LOADED); // Assuming component sets loading to LOADED even on error for simplicity
  });

  it("should not run query with invalid config", () => {
    spyOn(component, "runQuery");
    component.config = null as any; // Assuming null is invalid
    expect(component.runQuery).not.toHaveBeenCalled();
  });

  // Add more tests as necessary to cover all functionalities and edge cases
});
