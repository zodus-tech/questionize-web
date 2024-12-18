import { api } from './api'

export const departmentService = {
  async getAllDepartments() {
    const { data } = await api.get('/department/all')
    return data.content
  },

  async createDepartment(name: string) {
    const { data } = await api.post('/department/create', { name })
    return data
  },

  async deleteDepartment(id: string) {
    await api.delete(`/department/delete/${id}`)
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateDepartment(id: string, name: string) {
    await api.patch(`/department/update/${id}`, { name })
  },
}
