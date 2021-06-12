import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { CreateUserError } from "./CreateUserError";

let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
    });

    it("should be able create user", async () => {
        const user: ICreateUserDTO = {
            email: "teste@teste.com",
            name: "Teste",
            password: "testes",
        };

        const createdUser = await createUserUseCase.execute(user);

        expect(createdUser).toHaveProperty("id");
    });

    it("should not be able create user if user already exists", () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                email: "teste@teste.com",
                name: "Teste",
                password: "testes",
            };
    
            await createUserUseCase.execute(user);
            await createUserUseCase.execute(user);
        }).rejects.toBeInstanceOf(CreateUserError);
    });
});