import axios, { Axios } from "axios";
import { Project, Unit, Source, Commit, TextRecord } from "@/domain/models/moe";

class MoeApi {
  private readonly axios: Axios;

  constructor(baseURL: string) {
    this.axios = axios.create({
      baseURL: baseURL,
      timeout: 3000,
    });
  }

  projectList(): Promise<Array<Project>> {
    return this.axios.get("/project").then((response) => response.data);
  }

  projectAdd(project: { name: string }) {
    return this.axios
      .post("/project", project)
      .then((response) => response.data);
  }

  unitList(projectId: string): Promise<Array<Unit>> {
    return this.axios
      .get("/unit", {
        params: { project: projectId },
      })
      .then((response) => response.data);
  }

  unitSourceList(unitId: string): Promise<Array<Source>> {
    return this.axios
      .get("/unit", {
        params: { id: unitId },
      })
      .then((response) => response.data);
  }

  unitAdd(projectId: string, title: string, sourceList: Array<Source>) {
    return this.axios
      .post("/unit", {
        project: projectId,
        title,
        sourceList,
      })
      .then((response) => response.data);
  }

  commitList(unitId: string): Promise<Array<Commit>> {
    return this.axios
      .get("/commit", {
        params: { unit: unitId },
      })
      .then((response) => response.data);
  }

  commitRecordList(commitId: string): Promise<Array<TextRecord>> {
    return this.axios
      .get("/commit", {
        params: { id: commitId },
      })
      .then((response) => response.data);
  }

  commitAdd(unitId: string, recordList: Array<TextRecord>) {
    return this.axios
      .post("/commit", {
        unit: unitId,
        recordList,
      })
      .then((response) => response.data);
  }
}

const moeApi = new MoeApi("http://localhost:8000");

export default moeApi;
