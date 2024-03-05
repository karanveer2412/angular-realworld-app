import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { UserService } from "../../../../core/services/user.service";
import HomeComponent from "./home.component";
import { TagsService } from "../../services/tags.service";

describe("HomePage", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let userServiceStub: Partial<UserService>;
  let tagsServiceStub: Partial<TagsService>;
  let router: Router;

  beforeEach(async () => {
    // Mock UserService
    userServiceStub = {
      isAuthenticated: of(true), // Assume user is authenticated by default
    };

    // Mock TagsService
    tagsServiceStub = {
      getAll: () => of(["tag1", "tag2"]), // Mock tags data
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HomeComponent],
      providers: [
        { provide: UserService, useValue: userServiceStub },
        { provide: TagsService, useValue: tagsServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it('should set list to "feed" if user is authenticated', () => {
    expect(component.listConfig.type).toEqual("feed");
  });

  it('should redirect to login if trying to set list to "feed" and user is not authenticated', () => {
    spyOn(router, "navigate");
    userServiceStub.isAuthenticated = of(false); // User is not authenticated
    component.setListTo("feed");
    expect(router.navigate).toHaveBeenCalledWith(["/login"]);
  });

  it('should set list to "all" if user is not authenticated', () => {
    userServiceStub.isAuthenticated = of(false); // User is not authenticated
    component.ngOnInit(); // Re-initialize to apply changes
    expect(component.listConfig.type).toEqual("all");
  });

  // Add more tests as needed...
});
