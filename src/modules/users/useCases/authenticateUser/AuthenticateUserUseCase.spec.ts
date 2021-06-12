import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
        createUserUseCase = new CreateUserUseCase(usersRepository);
    });

    it("should be able authenticate user", async () => {
        const user: ICreateUserDTO = {
            email: "teste@teste.com",
            name: "Teste",
            password: "testes",
        };

        await createUserUseCase.execute(user);

        const response = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        });

        expect(response).toHaveProperty("token");
    });

    it("should not be able authenticate user if user not found", () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "",
                password: ""
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

    it("should not be able authenticate user if email or password incorrect", async () => {
        try {
            const user: ICreateUserDTO = {
                email: "teste@teste.com",
                name: "Teste",
                password: "testes",
            };
    
            await createUserUseCase.execute(user);
            await authenticateUserUseCase.execute({
                email: user.email,
                password: "1234"
            });
        } catch (error) {
            expect(error).toBeInstanceOf(IncorrectEmailOrPasswordError);
        }
    });
});