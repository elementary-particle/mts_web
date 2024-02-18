import axios, { Axios } from "axios";
import { Project, Unit, Source, Commit, TextRecord } from "@/domain/models/moe";

class MoeApi {
  private readonly axios: Axios;

  constructor(baseURL: string) {
    this.axios = axios.create({
      baseURL: baseURL,
      timeout: 3000,
      withCredentials: true,
    });
  }

  signIn(name: string, pass: string) {
    return this.axios
      .post("/auth/login", { name, pass })
      .then((response) => response.data);
  }

  projectList(): Promise<Array<Project>> {
    return this.axios.get("/project").then((response) => response.data);
  }

  projectAdd(project: { name: string }): Promise<string> {
    return this.axios
      .post("/project", project)
      .then((response) => response.data);
  }

  unitList(projectId: string): Promise<Array<Unit>> {
    return this.axios
      .get("/unit", {
        params: { projectId },
      })
      .then((response) => response.data);
  }

  unitSourceList(unitId: string): Promise<Array<Source>> {
    return this.axios
      .get("/unit/source", {
        params: { id: unitId },
      })
      .then((response) => response.data);
  }

  unitAdd(
    projectId: string,
    title: string,
    sourceList: Array<Source>
  ): Promise<string> {
    return this.axios
      .post("/unit", {
        projectId,
        title,
        sourceList,
      })
      .then((response) => response.data);
  }

  commitList(unitId: string): Promise<Array<Commit>> {
    return this.axios
      .get("/commit", {
        params: { unitId },
      })
      .then((response) => response.data);
  }

  commitRecordList(commitId: string): Promise<Array<TextRecord>> {
    return this.axios
      .get("/commit/record", {
        params: { id: commitId },
      })
      .then((response) => response.data);
  }

  commitAdd(unitId: string, recordList: Array<TextRecord>): Promise<string> {
    return this.axios
      .post("/commit", {
        unitId,
        recordList,
      })
      .then((response) => response.data);
  }
}

const moeApi = new MoeApi("http://localhost:8000/api");

export default moeApi;
