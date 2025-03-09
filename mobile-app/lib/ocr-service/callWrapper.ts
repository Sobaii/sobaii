import { OcrServiceClient } from "../stubs/ocr-service-dev/Ocr_serviceServiceClientPb";
import { FolderCreationRequest, FolderCreationResponse, FolderSearchRequest, FolderSearchResponse, ExtractFileRequest, SearchFileRequest, ModifyExpenseFieldRequest, ExtractFileResponse, MimeType, SearchFileResponse, ModifyExpenseFieldResponse, DeleteExpenseResponse, DeleteExpenseRequest } from "../stubs/ocr-service-dev/ocr_service_pb";

const client = new OcrServiceClient('http://localhost:50052', null, null)

export async function createFolder(userId: string, folderName: string): Promise<FolderCreationResponse.AsObject | null> {
  return new Promise((resolve, reject) => {
    const request = new FolderCreationRequest()
    request
    .setUserId(userId)
    .setFolderName(folderName)

    client.createFolder(request, {}, (err, response: FolderCreationResponse) => {
      if (err) {
        reject(null)
      } else {
        resolve(response.toObject())
      }
    })
  })
}

export async function retrieveFolders(userId: string): Promise<FolderSearchResponse.AsObject | null> {

  return new Promise((resolve, reject) => {
    const request = new FolderSearchRequest();
    request
    .setUserId(userId)
    .setQuery("")

    client.searchFolders(request, {}, (err, response: FolderSearchResponse) => {
      if (err) {
        reject(null)
      } else {
        resolve(response.toObject())
      }
    })
  })
}

export async function extractFileData(userId: string, folderName: string, file: Uint8Array, mimeType: MimeType): Promise<ExtractFileResponse.AsObject | null> {
  return new Promise((resolve, reject) => {
    const request = new ExtractFileRequest();
    request
    .setUserId(userId)
    .setFolderName(folderName)
    .setBinary(file)
    .setMimeType(mimeType)

    client.extractFileData(request, {}, (err, response: ExtractFileResponse) => {
        if (err) {
            reject(null);
        } else {
            resolve(response.toObject());
        }
    })
  });
}

export async function retrieveExpenses(userId: string): Promise<SearchFileResponse.AsObject | null> {
  
  return new Promise((resolve, reject) => {
    const request = new SearchFileRequest()
    request
    .setUserId(userId)
    .setFolderName("")
    .setIndex("")
    .setQuery("")

    client.searchFileData(request, {}, (err, response: SearchFileResponse) => {
      if (err) {
        reject(null)
      } else {
        resolve(response.toObject())
      }
    })
  })

}

export async function sortExpensesByFieldSimilarity(userId: string, fieldType: string, query: string): Promise<SearchFileResponse.AsObject | null> {

 return new Promise((resolve, reject) => {
    const request = new SearchFileRequest()
    request
    .setUserId(userId)
    .setFolderName("")
    .setIndex(fieldType)
    .setQuery(query)

    client.searchFileData(request, {}, (err, response: SearchFileResponse) => {
      if (err) {
        reject(null)
      } else {
        resolve(response.toObject())
      }
    })
  }) 

}

export async function modifyExpenseField(userId: string, expenseId: number, fieldType: string, fieldText: string): Promise<ModifyExpenseFieldResponse.AsObject | null> {
  
  return new Promise((resolve, reject) => {
    const request = new ModifyExpenseFieldRequest()
    request
    .setUserId(userId)
    .setExpenseId(expenseId)
    .setFieldType(fieldType)
    .setFieldText(fieldText)
  
    client.modifyExpenseField(request, {}, (err, response: ModifyExpenseFieldResponse) => {
       if (err) {
          reject(null)
        } else {
          resolve(response.toObject())
        }
    })
  })

}

export async function deleteExpense(userId: string, expenseId: number): Promise<DeleteExpenseResponse.AsObject | null> {

   return new Promise((resolve, reject) => {
    const request = new DeleteExpenseRequest()
    request
    .setUserId(userId)
    .setExpenseId(expenseId)
  
    client.deleteExpense(request, {}, (err, response: DeleteExpenseResponse) => {
       if (err) {
          reject(null)
        } else {
          resolve(response.toObject())
        }
    })
  })

}