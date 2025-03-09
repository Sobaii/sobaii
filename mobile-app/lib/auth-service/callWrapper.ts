import { AuthServiceClient } from "../stubs/auth-service/Auth_serviceServiceClientPb";
import { RetrieveUserRequest, RetrieveUserResponse, RetrieveInboxesResponse } from "../stubs/auth-service/auth_service_pb";

const client = new AuthServiceClient('http://localhost:50054', null, null)

export async function retrieveUser(userId: string): Promise<RetrieveUserResponse.AsObject | null> {
    return new Promise((resolve, reject) => {
        const request = new RetrieveUserRequest()
        request.setUserId(userId)

        client.retrieveUser(request, {}, (err, response: RetrieveUserResponse) => {
            if (err) {
                reject(null)
            } else {
                resolve(response.toObject())
            }
        })
    })
}

export async function retrieveInboxes(userId: string): Promise<RetrieveInboxesResponse.AsObject | null> {
    return new Promise((resolve, reject) => {
        const request = new RetrieveUserRequest()
        request.setUserId(userId)

        client.retrieveInboxes(request, {}, (err, response: RetrieveInboxesResponse) => {
            if (err) {
                reject(null)
            } else {
                resolve(response.toObject())
            }
        })
    })
}