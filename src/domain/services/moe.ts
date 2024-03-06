import axios, { Axios } from "axios";
import {
  Project,
  Unit,
  Source,
  Commit,
  TextRecord,
  UserInfo,
} from "@/domain/models/moe";

class MoeApi {
  private readonly axios: Axios;

  constructor(baseURL: string) {
    this.axios = axios.create({
      baseURL: baseURL,
      timeout: 3000,
      withCredentials: true,
    });
  }

  signIn(name: string, pass: string): Promise<void> {
    return this.axios.post("/auth/sign-in", { name, pass }).then(() => {});
  }

  signOut(): Promise<void> {
    return this.axios.get("/auth/sign-out").then(() => {});
  }

  checkClaim(): Promise<UserInfo | null> {
    return this.axios.get("/auth/claim").then(({ data }) => data);
  }

  userById(id: string): Promise<{ id: string; name: string }> {
    return this.axios
      .get("/auth/user", { params: { id } })
      .then(({ data }) => data);
  }

  projectList(): Promise<Project[]> {
    return this.axios.get("/project").then(({ data }) => data);
  }

  projectById(id: string): Promise<Project> {
    return this.axios
      .get("/project/by-id", { params: { id } })
      .then(({ data }) => data);
  }

  projectAdd(project: { name: string }): Promise<string> {
    return this.axios.post("/project", project).then(({ data }) => data);
  }

  unitList(projectId: string): Promise<Unit[]> {
    return this.axios
      .get("/unit", {
        params: { "project-id": projectId },
      })
      .then(({ data }) => data);
  }

  unitById(id: string): Promise<Unit> {
    return this.axios
      .get("/unit/by-id", { params: { id } })
      .then(({ data }) => data);
  }

  unitSourceList(unitId: string): Promise<Source[]> {
    return this.axios
      .get("/unit/source", {
        params: { id: unitId },
      })
      .then(({ data }) => data);
  }

  unitAdd(
    projectId: string,
    title: string,
    sourceList: Array<Source>,
  ): Promise<string> {
    return this.axios
      .post("/unit", {
        projectId,
        title,
        sourceList,
      })
      .then(({ data }) => data);
  }

  commitList(unitId: string): Promise<Commit[]> {
    return this.axios
      .get("/commit", {
        params: { "unit-id": unitId },
      })
      .then(({ data }) => data);
  }

  commitById(id: string): Promise<Commit> {
    return this.axios
      .get("/commit/by-id", { params: { id } })
      .then(({ data }) => data);
  }

  commitRecordList(commitId: string): Promise<TextRecord[]> {
    return this.axios
      .get("/commit/record", {
        params: { id: commitId },
      })
      .then(({ data }) => data);
  }

  commitAdd(unitId: string, recordList: Array<TextRecord>): Promise<string> {
    return this.axios
      .post("/commit", {
        unitId,
        recordList,
      })
      .then(({ data }) => data);
  }
}

const moeApi = new MoeApi(process.env.VITE_API_BASE_URL ?? "/api");

export default moeApi;
