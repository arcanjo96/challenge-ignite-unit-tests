import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: IUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
    });

    it("should be able create user", async () => {
        const user: ICreateUserDTO = {
            email: "teste@teste.com",
            name: "Teste",
            password: "testes",
        };

        const createdUser = await usersRepository.create(user);

        const response = await showUserProfileUseCase.execute(createdUser.id as string);

        expect(response.id).toBe(createdUser.id);
    });

    it("should not be able create user if user not found", () => {
        expect(async () => {
            await showUserProfileUseCase.execute("teste");
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    });
});