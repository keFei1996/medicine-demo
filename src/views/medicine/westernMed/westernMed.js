import { drugList as drugListCopy } from "@/views/medicine/westernMed/data";
import CatTableSelect from "@/components/TableSelect/CatTableSelect";
import {cloneObj, isArray} from "@/utils/typePub";

const presItemCopy = [
  [
    { groupIndex: 0 }
  ]
];
const itemActiveCopy = { groupIndex: 0, itemIndex: 0 };
export default {
  name: "westernMed",
  components: {
    CatTableSelect
  },
  data() {
    return {
      form: {
        presList: [{ name: '普通院内处方', groupList: cloneObj(presItemCopy) }], // 处方列表
      },
      rules: {},
      formLoading: false,
      presIndex: 0,
      activeNames: [0],
      itemActive: cloneObj(itemActiveCopy),
      drugList: drugListCopy,
      drugListCopy,
      medColumns: [
        {
          key: 'medName',
          label: '药品名称',
          width: 140
        },
        {
          key: 'spec',
          label: '规格'
        },
        {
          key: 'presUnit',
          label: '单位'
        },
        {
          key: 'formName',
          label: '剂型'
        },
        {
          key: 'stockNum',
          label: '参考库存'
        },
        {
          key: 'retaPrice',
          label: '单价'
        },
        {
          key: 'factoryName',
          label: '产地'
        },
        {
          key: 'inputcode1',
          label: '拼'
        },
        {
          key: 'inputcode2',
          label: '笔'
        }
      ],
      medProps: {
        key: 'medId',
        label: 'medName'
      },
      rowColName: '',   // 输入框激活的状态
      usageList: [
        { id: 'qd', name: '一日一次', day: 1, num: 1 },
        { id: 'bid', name: '一日二次', day: 1, num: 2 },
        { id: 'tid', name: '一日三次', day: 1, num: 3 },
        { id: 'qid', name: '一日四次', day: 1, num: 4 },
        { id: 'qm', name: '早上一次', day: 1, num: 1 }
      ],
      usageListCopy: [
        { id: 'qd', name: '一日一次', day: 1, num: 1 },
        { id: 'bid', name: '一日二次', day: 1, num: 2 },
        { id: 'tid', name: '一日三次', day: 1, num: 3 },
        { id: 'qid', name: '一日四次', day: 1, num: 4 },
        { id: 'qm', name: '早上一次', day: 1, num: 1 }
      ],
      modeListCopy: [
        { id: 'im', name: '肌注' },
        { id: 'iv', name: '静推' },
        { id: 'ivgtt', name: '静滴' },
        { id: 'db', name: '滴鼻' },
        { id: 'de', name: '滴耳' },
        { id: 'dy', name: '滴眼' },
        { id: 'kh', name: '口含' },
        { id: 'wy', name: '外用' },
        { id: 'qt', name: '其他' }
      ],
      modeList: [
        { id: 'im', name: '肌注' },
        { id: 'iv', name: '静推' },
        { id: 'ivgtt', name: '静滴' },
        { id: 'db', name: '滴鼻' },
        { id: 'de', name: '滴耳' },
        { id: 'dy', name: '滴眼' },
        { id: 'kh', name: '口含' },
        { id: 'wy', name: '外用' },
        { id: 'qt', name: '其他' }
      ],
      remarkList: [
        { id: 1, name: '餐前' },
        { id: 2, name: '餐时' },
        { id: 3, name: '餐后' },
        { id: 4, name: '睡前' }
      ],
      firstLineField: ['medId', 'useRatio', 'doseRatio', 'usage', 'mode', 'day', 'rate', 'presRatio', 'remark'],   // 第一行需要填的字段
      secondLineField: ['medId', 'useRatio', 'doseRatio', 'presRatio', 'remark'],  // 不同行不同的字段
      inputSelectList: ['medId', 'usage', 'mode', 'remark'],  // 需要全选的字段
      focusRowItem: '',  // 键盘聚焦的字段
      notUseEnterUp: false,  // 不使用键盘回车
      keyupField: ['useUnit', 'medId', 'formName', 'spec', 'factoryName', 'useRatio', 'doseRatio', 'usage', 'mode', 'day', 'rate', 'presRatio', 'remark'],  // 表格的所有字段
      listenFormFlag: false
    }
  },
  created() {
  },
  mounted() {
    document.addEventListener('keyup', this.handleKeyup, false)
  },
  destroyed() {
    document.removeEventListener('keyup', this.handleKeyup)
    document.removeEventListener('keyup', this.handleFormKeyup)
  },
  methods: {
    // 单元格点击
    cellClick(row, column, cell) {
      this.itemActive = { groupIndex: row.groupIndex, itemIndex: row.index };
      const activeKey = `groupList.${row.groupIndex}.${row.index}.${column.property}`
      this.rowColName = activeKey;
      if(this.firstLineField.includes(column.property)) {
        this.focusRowItem = activeKey;
      }else {
        this.focusRowItem = '';
        return
      }
      this.$nextTick(() => {
        if(this.$refs[activeKey]) {
          const activeDom =  this.$refs[activeKey];
          activeDom[0].focus();
          activeDom[0].select && activeDom[0].select()
        }
      })
    },
    // 按下回车键
    // 处理表单键盘操作
    handleFormKeyup(e) {
      console.log(e)
      const { rowColName, keyupField } = this;
      if(rowColName) {
        const formDom = this.$refs['my-form'];
        const nameArr = rowColName.split('.');
        const groupIndex = nameArr[1];
        const index = nameArr[2];
        const name = nameArr[3];
        let nameIndex = 0;
        keyupField.forEach((ev, i) => {
          if(ev === name) {
            nameIndex = i;
          }
        })
        if(e.key === 'ArrowUp') {

        }else if(e.key === 'ArrowDown') {

        }else if(e.key === 'ArrowLeft') {
          if(nameIndex > 0) {
            nameArr[3] = keyupField[--nameIndex];
            this.rowColName = nameArr.join('.')
          }
        }else if(e.key === 'ArrowRight') {
          if(nameIndex < keyupField.length - 1) {
            nameArr[3] = keyupField[++nameIndex];
            this.rowColName = nameArr.join('.')
          }
        }else if(e.key === 'Enter') {
          if(this.focusRowItem === '') {
            // 没有输入框聚焦时
            this.focusRowItem = rowColName;
            this.inputFocusPub(rowColName)
          }else {
            if(this.notUseEnterUp) {
              this.notUseEnterUp = false;
              return
            }
            const { focusRowItem } = this;
            formDom.validateField(focusRowItem, (errorMessage) => {
              if(errorMessage !== '') {
                this.$message.error(errorMessage);
              }else {
                let lineField, fieldIndex;  // 需要输入的input列表
                if(+index === 0) {
                  lineField = this.firstLineField;
                }else {
                  lineField = this.secondLineField;
                }
                lineField.forEach((ev, i) => {
                  if(ev === name) {
                    fieldIndex = i;
                  }
                });
                if(fieldIndex === lineField.length - 1) {
                  // 最后一个字段，新增数组
                  this.groupAddClick(e)
                }else {
                  // 下一个字段下标
                  const nextFieldIndex = fieldIndex + 1;
                  const activeKey = `groupList.${groupIndex}.${index}.${lineField[nextFieldIndex]}`;
                  this.rowColName = activeKey;
                  this.focusRowItem = activeKey;
                  this.$nextTick(() => {
                    const activeDom =  this.$refs[activeKey];
                    activeDom[0].focus();
                    activeDom[0].select && activeDom[0].select()
                  })
                }
              }
            })
          }
        }else if(e.key === 'Escape') {
          this.focusRowItem = '';
        }
      }
    },
    // 公共输入框激活方法
    inputFocusPub(activeKey) {
      this.$nextTick(() => {
        if(this.$refs[activeKey]) {
          const activeDom = this.$refs[activeKey];
          activeDom[0].focus();
          activeDom[0].select && activeDom[0].select();
        }
      })
    },
    // 表单点击
    formClick(event) {
      if(!this.listenFormFlag) {
        this.listenFormFlag = true;
        document.addEventListener('keyup', this.handleFormKeyup, false);
      }
      event.stopPropagation();
    },
    // 全局的键盘监听
    handleKeyup(e) {
      if(e.key === 's' && e.altKey) {
        this.savePost(e)
      }else if(e.key === 'F2') {
        this.lineAddClick(e)
      }else if(e.key === 'F3') {
        this.lineDelClick(e)
      } else if(e.key === 'F4') {
        this.groupAddClick(e)
      } else if(e.key === 'F5') {
        this.groupDelClick(e)
      }
    },
    // 下拉框改变值
    selectChange(e, groupIndex, index, type) {
      let list = [];
      let rowItem = {};
      if(type === 'usage') {
        // 用法
        list = this.usageList;
      }else if(type === 'mode') {
        // 给药方式
        list = this.modeList;
      }else if(type === 'medId') {
        // 药名
        list = this.drugList;
      }
      list.forEach(ev => {
        if(ev.id === e || ev.medId === e) {
          rowItem = ev;
        }
      })
      const { presIndex, form } = this;
      const presList = form.presList;
      const groupItem = presList[presIndex].groupList[groupIndex];
      const medItem = presList[presIndex]['groupList'][groupIndex][index];
      // 赋值
      if(type === 'usage') {
        // 用法
        this.$set(medItem, 'usageName', rowItem['name'])
        this.$set(medItem, 'day', rowItem['day'])
        this.$set(medItem, 'rate', rowItem['num'])
      }else if(type === 'mode') {
        // 给药方式
        this.$set(medItem, 'modeName', rowItem['name'])
      }else if(type === 'medId') {
        // 药名
        if(rowItem.stockNum === 0) {
          this.$message.error('当前药品库存为0');
          this.$set(medItem, 'medId', '');
          this.$nextTick(() => {
            this.$refs[`groupList.${groupIndex}.${index}.medId`][0].focus();
          })
          return
        }else {
          for(let i=0; i< groupItem.length; i++) {
            if(groupItem[i].medName === rowItem.medName) {
              this.$message.error('该药品已经存在');
              this.$set(medItem, 'medId', '');
              this.$nextTick(() => {
                this.$refs[`groupList.${groupIndex}.${index}.medId`][0].focus();
              })
              return;
            }
          }
          const keyArr = ['medName', 'formName', 'spec', 'factoryName', 'useUnit', 'doseUnit', 'doseRatio', 'useRatio', 'presRatio', 'presUnit'];
          keyArr.forEach(ev => {
            this.$set(medItem, ev, rowItem[ev])
          });
        }
      }
      const formDom = this.$refs['my-form'];
      let activeKey;
      this.$nextTick(() => {
        // 验证变化
        if(type === 'usage') {
          // 用法
          formDom.validateField(`groupList.${groupIndex}.${index}.usage`);
          formDom.validateField(`groupList.${groupIndex}.${index}.day`);
          formDom.validateField(`groupList.${groupIndex}.${index}.rate`);
          activeKey = `groupList.${groupIndex}.${index}.mode`;
        }else if(type === 'mode') {
          formDom.validateField(`groupList.${groupIndex}.${index}.mode`);
          activeKey = `groupList.${groupIndex}.${index}.day`;
          this.notUseEnterUp = true;
        }else if(type === 'medId') {
          formDom.validateField(`groupList.${groupIndex}.${index}.useRatio`);
          formDom.validateField(`groupList.${groupIndex}.${index}.doseRatio`);
          formDom.validateField(`groupList.${groupIndex}.${index}.presRatio`);
          formDom.validateField(`groupList.${groupIndex}.${index}.medId`);
          activeKey = `groupList.${groupIndex}.${index}.useRatio`;
        }
        this.rowColName = activeKey;
        this.focusRowItem = activeKey;
        this.$nextTick(() => {
          if(this.$refs[activeKey]) {
            const activeDom = this.$refs[activeKey];
            activeDom[0].focus();
            activeDom[0].select && activeDom[0].select();
          }
        })
      })
    },
    // 下拉框隐藏显示
    selectVisible(val, type) {
      if(val) {
        if(type === 'mode') {
          this.modeList = this.modeListCopy;
        }else if(type === 'usage') {
          this.usageList = this.usageListCopy;
        }else if(type === 'medId') {
          this.drugList = this.drugListCopy;
        }
      }
    },
    // 搜索过滤方法
    filterMethod(val, searchArr=[], list, listCopy) {
      if(val) {
        if(val.charCodeAt(0) <= 255) {
          val = val.toUpperCase();
        }
        this[list] = this[listCopy].filter((item) => {
          for(let i=0; i <= searchArr.length-1; i++) {
            let searchName = item[searchArr[i]] + '';
            if(searchName.charCodeAt(0) <= 255) {
              searchName = searchName.toUpperCase();
            }
            if(searchName.indexOf(val) > -1) {
              return true
            }
          }
        })
      }else {
        this[list] = this[listCopy]
      }
    },
    // 大于0的正整数
    validateDigits(rule, value, callback) {
      if (!value) {
        callback(new Error(rule.name || '请输入数量'))
      } else {
        if(value > 0) {
          callback()
        }else{
          callback(new Error('请输入大于0的整数'))
        }
      }
    },
    rulesReturn(str1, str2) {
      return { required: true, message: '', trigger: 'change' }
    },
    // 表格头加入必填
    starAdd({ column }) {
      const nameArr = ['药名名称', '用量', '剂量', '配药数量', '用法', '给药方式', '用药天数', '用药次数'];
      if(nameArr.includes(column.label)) {
        return 'star';
      }
    },
    // 行单元颜色
    rowStyle({row}) {
      const { itemActive } = this;
      if(row.groupIndex === itemActive.groupIndex && row.index === itemActive.itemIndex) {
        return {
          background: '#ECF5FF'
        }
      }else {
        return {
          background: '#fff'
        }
      }
    },
    // 单元格颜色
    cellStyle({row, column}) {
      const rowColName =  `groupList.${row.groupIndex}.${row.index}.${column.property}`;
      if(rowColName === this.rowColName) {
        return {
          background: '#FFFFE6'
        }
      }else {
        return {
          background: 'transparent'
        }
      }
    },
    rowClassName({row, rowIndex}) {
      row.index = rowIndex;
    },
    // 保存提交
    async savePost(event) {
      await this.saveClick(event);
      this.$message.success('保存成功')
    },
    // 点击保存
    saveClick(event) {
      return new Promise((resolve, reject) => {
        if(this.form.presList.length === 0) {
          resolve()
          return
        }
        const formDom = this.$refs['my-form']
        formDom.validate((valid, object) => {
          if(valid) {
            formDom.clearValidate();
            resolve()
          }else {
            formDom.clearValidate();
            const keys = Object.keys(object)
            Object.keys(object).forEach(key => {
              formDom.validateField(key)
            })
            const activeKey = keys[0];
            console.log('activeKey', activeKey)
            this.rowColName = activeKey;
            this.focusRowItem = activeKey;
            this.$nextTick(() => {
              // event.stopPropagation();
              const activeDom =  this.$refs[activeKey];
              activeDom[0].focus();
              activeDom[0].select && activeDom[0].select();
              this.$message.error(object[activeKey][0].message)
            })
          }
        })
      })
    },
    boxClick(e) {
      if(this.listenFormFlag) {
        this.listenFormFlag = false;
        document.removeEventListener('keyup', this.handleFormKeyup);
      }
    },
    // ifrmae发送消息
    postMessage() {
      // b页面
      parent.postMessage(
        { name: 'zhu'},
        "http://localhost:8080"
      );
    },
    // 重置
    reset() {
      this.itemActive = cloneObj(itemActiveCopy);
      this.rowColName = '';
      this.focusRowItem = '';
      this.$refs['my-form'].clearValidate();
      this.countActiveNames();
    },
    // 计算activeNames
    countActiveNames() {
      const {presIndex} = this;
      const presList = this.form.presList;
      const activeNames = [];
      presList[presIndex].groupList.forEach((ev, i) => {
        activeNames.push(i)
      })
      this.activeNames = activeNames;
    },
    // 处方添加
    async presAddClick(event) {
      await this.saveClick(event)
      const presList = this.form.presList;
      presList.push({ name: '普通院内处方', groupList: cloneObj(presItemCopy)});
      this.presIndex = presList.length - 1;
      this.reset();
      this.openMedSelect(event);
    },
    // 处方删除
    presDelClick(event, index) {
      this.$confirm('您是否确认删除该处方？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        const presList = this.form.presList;
        if(index <= this.presIndex) {
          this.presIndex = presList.length - 2;
        }
        presList.splice(index, 1);
        this.delAllJudge(event);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除操作'
        })
      })
    },
    // 处方下标点击
    async presIndexClick(event, index) {
      await this.saveClick(event);
      this.presIndex = index;
      this.reset()
    },
    // 计算groupIndex
    countGroupIndex() {
      const {presIndex, form} = this;
      const presList = form.presList;
      presList[presIndex].groupList.forEach((ev, groupIndex) => {
        ev.forEach(ev1 => {
          console.log(ev1)
          ev1.groupIndex = groupIndex;
        })
      })
    },
    // 所有删除之后进行判断
    delAllJudge(event) {
      const {itemActive, presIndex, form} = this;
      const presList = form.presList;
      if(presList.length === 0) {
        setTimeout(() => {
          this.presAddClick(event);
        }, 300)
      }else {
        const groupList = presList[presIndex].groupList;
        // 药品组为0时
        if(groupList.length === 0) {
          this.presDelClick(presIndex)
        }else {
          if(!groupList[itemActive.groupIndex]) {
            itemActive.groupIndex--
          }
          // // 如果行删除完
          if(groupList[itemActive.groupIndex].length === 0) {
            this.groupDelContent(event);
            return
          }else {
            if(!groupList[itemActive.groupIndex][itemActive.itemIndex]) {
              itemActive.itemIndex = groupList[itemActive.groupIndex].length - 1;
            }
          }
          this.countGroupIndex();
          this.countActiveNames();
        }
      }
    },
    // 新增行
    async lineAddClick(event) {
      await this.saveClick(event);
      const { itemActive, presIndex, form } = this;
      const presList = form.presList;
      const groupList = presList[presIndex].groupList;
      const groupIndex = itemActive.groupIndex;
      const groupItem = groupList[groupIndex];
      groupItem.push({ groupIndex });
      this.itemActive = { groupIndex, itemIndex: groupList[groupIndex].length - 1 };
      this.openMedSelect(event);
    },
    // 删除行
    lineDelClick(event) {
      const { itemActive, presIndex, form } = this;
      const presList = form.presList;
      presList[presIndex].groupList[itemActive.groupIndex].splice(itemActive.itemIndex, 1);
      this.delAllJudge(event);
    },
    // 新增组
    async groupAddClick(event) {
      await this.saveClick(event);
      const { activeNames, presIndex, form } = this;
      const presList = form.presList;
      const groupList = presList[presIndex].groupList;
      if(groupList.length >= 5) {
        this.$message.warning('最多5组');
        return
      }
      const groupIndex = groupList.length;
      groupList.push([{ groupIndex }]);
      // 添加折叠面板
      activeNames.push(groupIndex);
      this.itemActive = { groupIndex: groupList.length-1, itemIndex: 0 };
      this.openMedSelect(event)
    },
    // 打开药品选择框
    openMedSelect(event) {
      const { presIndex, form } = this;
      const presList = form.presList;
      const groupList = presList[presIndex].groupList;
      const groupLastIndex = groupList.length - 1;
      const activeKey = `groupList.${groupLastIndex}.${groupList[groupLastIndex].length - 1}.medId`;
      this.rowColName = activeKey;
      this.focusRowItem = activeKey;
      // 拉开选择药品下拉框
      this.$nextTick(() => {
        event.stopPropagation();
        this.$refs[activeKey][0].focus();
      })
    },
    // 删除组
    groupDelClick(event, showToast=false) {
      this.$confirm('您是否确认删除该分组？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.groupDelContent(event);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除操作'
        })
      })
    },
    // 删除逻辑
    groupDelContent(event) {
      const { itemActive, presIndex, form } = this;
      const presList = form.presList;
      const groupList = presList[presIndex].groupList;
      groupList.splice(itemActive.groupIndex, 1);
      this.delAllJudge(event);
    }
  }
}
