import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {Injectable} from '@angular/core';
import {Platform, Events} from 'ionic-angular';
import {NativeService} from '../../services/NativeService'
@Injectable()
export class NativeProvider {
  database: SQLiteObject;
  win_db: any;//H5数据库对象
  win: any = window;//window对象
  constructor(private platform: Platform,
              private sqlite: SQLite, private events: Events, private native: NativeService) {
  }

  /**
   * 创建数据库
   */
  initDB() {
    if (this.native.isMobile()) {
      this.sqlite.create({
        name: 'myDb.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          //创建表
          this.createTable();
          this.events.publish('db:create');
          console.log('数据库创建完成');
        })
        .catch(e => {
          console.log('数据库创建失败')
          this.events.publish('db:create');
        });
    } else {
      //H5数据库存储
      this.win_db = this.win.openDatabase("myDb.db", '1.0', 'database', 5 * 1024 * 1024);//声明H5 数据库大小
      this.createTable();
      this.events.publish('db:create');
    }
  }

  /**
   * 创建表
   */
  async createTable() {
    // this.querySql('', []);
    //可能存在多个执行创建表语句，只需最后一个使用await
    this.executeSql('create table orders (id INTEGER PRIMARY KEY AUTOINCREMENT, username text,clothesid text,status text,number long,price long,description text, imgurl text,ordertime text)', []);
    this.executeSql('create table image (id INTEGER PRIMARY KEY AUTOINCREMENT, username text,imageurl text)', []);
    await this.executeSql('CREATE TABLE clothes(id text PRIMARY KEY NOT NULL,clickurl TEXT,itemurl TEXT , nick TEXT,picturl TEXT,\
      provcity TEXT,reserveprice text,shoptitle text,title text,zkfinalprice text,zkfinalpricewap text,favoritesid long,volume long,\
      status long,sellerid long,numiid long', []);

  }

  /**
   * 执行语句
   */
  executeSql(sql: string, array: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.native.isMobile()) {
        if (!!!!this.database) {
          this.database.executeSql(sql, array).then((data) => {
            resolve(data);
          }, (err) => {
            reject(err);
            console.log('Unable to execute sql: ' + err);
          });
        }
      }
    });
  }

  /**
   * 查询H5数据库
   */
  execWebSql(sql: string, params: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.win_db.transaction((tx) => {
            tx.executeSql(sql, params,
              (tx, res) => resolve(res),
              (tx, err) => reject(err));
          },
          (err) => reject(err));
      } catch (err) {
        reject(err);
      }
    });
  };

  // 查询数据
  query(params: any[]) {
    let sql = 'select * from orders where status = ? and username = ?';
    if (params && Array.isArray(params)) {
      return this.database.executeSql(sql, params).then(val => {
        if (val.rows.length == 0) {
          console.log('没有数据')
          let models = []
          return models;
        } else {
          let models = [];
          for (let i = 0; i < val.rows.length; i++) {
            models.push(val.rows.item(i));
          }
          console.log(models)
          return models;
        }
      }).catch(error => {
        return error;
      })
    }
  }

  // 查询数据
  queryById(params: Array<any>) {
    if (!!!!this.native.isMobile()) {
      let sql = 'select * from orders where clothesid = ? and username = ?';
      if (params && Array.isArray(params)) {
        return this.database.executeSql(sql, params).then(val => {
          if (val.rows.length == 0) {
            console.log('没有数据');
            let models = [];
            return models;
          } else {
            let models = [];
            for (let i = 0; i < val.rows.length; i++) {
              models.push(val.rows.item(i));
            }
            console.log(models);
            return models;
          }
        }).catch(error => {
          return error;
        })
      }
    }
  }

  // 插入数据
  insert(params: any[]) {
    if (!!!!this.native.isMobile()) {
      let sql = 'insert into orders (username,status,clothesid,description,imgurl,number,ordertime,price) values(?,?,?,?,?,?,?,?)';
      if (params && Array.isArray(params)) {
        return this.database.executeSql(sql, params).then(val => {
          if (val.rows.item.length > 0) {
            console.log('插入成功');
            return true;
          } else {
            console.log('插入失败');
            return false;
          }
        }).catch(error => {
          return error;
        })
      }
    }
  }

  // 更新数据
  update(params: any[]) {
    if (!!!!this.native.isMobile()) {
      let sql = 'update orders set status = ?, number = ? where clothesid = ? and username = ?';
      if (params && Array.isArray(params)) {
        return this.database.executeSql(sql, params).then(val => {
          if (val.rows.item.length > 0) {
            console.log('更新成功');
            return true;
          } else {
            console.log('更新失败');
            return false;
          }
        }).catch(error => {
          return error;
        })
      }
    }
  }

  // 删除数据
  delete(params: any[]) {
    if (this.native.isMobile()) {
      let sql = 'DELETE FROM orders WHERE clothesid = ? and username = ?';
      if (params) {
        return this.database.executeSql(sql, params).then(val => {
          if (val.rows.item.length > 0) {
            console.log('删除成功');
            return true;
          } else {
            console.log('删除失败');
            return false;
          }
        }).catch(error => {
          return error;
        })
      }
    }
  }

  // 查询数据
  /*
   * table 表名
   * params 查询字段值
   * conditions 查询条件
   *values 查询值
   * */
  querys(table: string, params: any[], conditions: any[], values: any[]) {
    if (table && conditions && Array.isArray(conditions)) {
      let sql = 'select ';
      if (params == null) {
        sql = 'select * from ';
      } else {
        for (let i = 0; i < params.length; i++) {
          if (i == params.length - 1) {
            sql += params[i] + ' from '
            continue
          }
          sql += params[i] + ', '
        }
      }
      sql += table;
      console.log(sql);
      if (conditions.length > 0) {
        for (let i = 0; i < conditions.length; i++) {
          if (i == 0) {
            sql += ' where ' + conditions[i] + '= ?'
            continue
          }
          sql += ' , ' + params[i] + ' = ?';
        }
      }
      console.log(sql);
      return this.database.executeSql(sql, values).then(val => {
        if (val.rows.length == 0) {
          console.log('没有数据')
          let models = []
          return models;
        } else {
          let models = [];
          for (let i = 0; i < val.rows.length; i++) {
            models.push(val.rows.item(i));
          }
          console.log(models)
          return models;
        }
      }).catch(error => {
        return error;
      })
    }
  }

  // 更新数据
  updates(table: string, params: any[], conditions: any[], values: any[]) {
    if (!!!!this.native.isMobile()) {
      if (table && params && Array.isArray(params)) {
        let sql: string = 'update ' + table;
        for (let i = 0; i < params.length; i++) {
          if (i == 0) {
            sql += ' set ' + params[i] + '= ?'
            continue
          }
          sql += ' , ' + params[i] + ' = ?';
        }
        console.log(sql)
        if (conditions.length > 0) {
          for (let i = 0; i < conditions.length; i++) {
            if (i == 0) {
              sql += ' where ' + conditions[i] + '= ?'
              continue;
            }
            sql += ' , ' + params[i] + ' = ?';
          }
        }
        console.log(sql)
        return this.database.executeSql(sql, values).then(val => {
          if (val.rows.item.length > 0) {
            console.log('更新成功');
            return true;
          } else {
            console.log('更新失败');
            return false;
          }
        }).catch(error => {
          return error;
        })
      }
    }
  }
}
