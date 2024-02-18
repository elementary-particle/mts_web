class Project {
  readonly id?: string;
  readonly name: string;

  constructor() {
    this.name = "";
  }
}

class Unit {
  readonly id?: string;
  readonly title: string;
  readonly commitId?: string;

  constructor(title: string) {
    this.title = title;
  }
}

class Source {
  sq: number;
  content: string;
  meta: string;

  constructor(sq: number, content: string, meta: string) {
    this.sq = 0;
    this.content = content;
    this.meta = meta;
  }
}

class Commit {
  id!: string;
  createdAt!: string;
}

class TextRecord {
  sq: number;
  content: string;

  constructor(sq: number, content: string) {
    this.sq = sq;
    this.content = content;
  }
}

export { Project, Unit, Source, Commit, TextRecord };
