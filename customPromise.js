const State = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
};

class CustomPromise {
  #thenCbs = [];
  #catchCbs = [];
  state = State.PENDING;
  #value;

  constructor(cb) {
    try {
      cb(this.#success.bind(this), this.#fail.bind(this));
    } catch (e) {
      this.#fail(e);
    }
  }

  #runCallbacks() {
    if (this.state === State.FULFILLED) {
      this.#thenCbs.forEach((callback) => {
        callback(value);
      });
    }

    if (this.state === State.REJECTED) {
      this.#catchCbs.forEach((callback) => {
        callback(value);
      });
    }
  }

  #success(value) {
    if (this.state !== State.PENDING) return;
    this.value = value;
    this.state = State.FULFILLED;
    this.#runCallbacks();
    this.#thenCbs = [];
  }

  #fail(value) {
    this.state = State.REJECTED;
    this.#runCallbacks();
    this.#catchCbs = [];
  }

  then(thenCb, catchCb) {
    return new CustomPromise((resolve, reject) => {
      this.#thenCbs.push((res) => {
        if (thenCb === null) {
          resolve(res);
          return;
        }

        try {
          resolve(thenCb(res));
        } catch (err) {
          reject(err);
        }
      });

      this.#catchCbs.push((res) => {
        if (thenCb === null) {
          reject(res);
          return;
        }

        try {
          resolve(catchCb(res));
        } catch (err) {
          reject(err);
        }
      });

      this.#runCallbacks();
    });
  }

  catch(cb) {
    this.#catchCbs.push(cb);
  }
}
