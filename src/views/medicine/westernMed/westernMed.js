import { drugList } from "@/views/medicine/westernMed/data";
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
      drugList,
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
      rowColName: '',
      keyArr: ['medName', 'formName', 'spec', 'factoryName', 'useUnit', 'doseUnit', 'doseRatio', 'useRatio', 'presRatio', 'presUnit'],
      usageList: [
        { code: 'qd', name: '一日一次', day: 1, num: 1 },
        { code: 'bid', name: '一日二次', day: 1, num: 2 },
        { code: 'tid', name: '一日三次', day: 1, num: 3 },
        { code: 'qid', name: '一日四次', day: 1, num: 4 },
        { code: 'qm', name: '早上一次', day: 1, num: 1 }
      ],
      usageColumns: [
        {
          key: 'code',
          label: '代码',
          width: 70
        },
        {
          key: 'name',
          label: '名字',
          width: 100
        }
      ],
      usageProps: {
        key: 'name',
        label: 'name'
      },
      modeList: [
        { code: 'po', name: '口服' },
        { code: 'im', name: '肌注' },
        { code: 'iv', name: '静推' },
        { code: 'ivgtt', name: '静滴' },
        { code: 'db', name: '地鼻' }
      ],
      remarkList: [
        { code: 1, name: '餐前' },
        { code: 2, name: '餐时' },
        { code: 3, name: '餐后' },
        { code: 4, name: '睡前' }
      ]
    }
  },
  created() {

  },
  methods: {
    // 用法改变
    usageChange(e, groupIndex, index) {
      if(e) {
        const { presIndex, form } = this;
        const presList = form.presList;
        this.$set(presList[presIndex]['groupList'][groupIndex][index], 'day', e['day'])
        this.$set(presList[presIndex]['groupList'][groupIndex][index], 'rate', e['num'])
        const formDom = this.$refs['my-form']
        formDom.validateField(`groupList.${groupIndex}.${index}.day`);
        formDom.validateField(`groupList.${groupIndex}.${index}.rate`);
        // const activeKey = `groupList.${groupIndex}.${index}.mode`;
        // this.rowColName = activeKey;
        // this.$nextTick(() => {
        //   this.$refs[activeKey][0].visible = true;
        // })
      }
    },
    // 大于0的正整数
    validateDigits(rule, value, callback) {
      if (value === '') {
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
    // 单元格点击
    cellClick(row, column, cell, event) {
      this.itemActive = { groupIndex: row.groupIndex, itemIndex: row.index };
      // this.rowColName = `${column.property}${row.groupIndex}${row.index}`;
      this.rowColName = `groupList.${row.groupIndex}.${row.index}.${column.property}`;
      event.stopPropagation();
    },
    // 点击保存
    saveClick(event) {
      return new Promise((resolve, reject) => {
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
            this.$nextTick(() => {
              event.stopPropagation();
              const name = activeKey.split('.')[3];
              const selectArr = ['medId', 'usage', 'mode'];
              const activeDom =  this.$refs[activeKey];
              console.log('activeDom', activeDom)
              if(selectArr.includes(name)) {
                activeDom[0].visible = true;
              }else {
                activeDom[0].focus();
              }
              this.$message.error(object[activeKey][0].message)
            })
          }
        })
      })
    },
    boxClick(e) {
      this.rowColName = ''
    },
    // 表格列表切换
    tableRowChange(e, groupIndex, index) {
      if(e) {
        if(e.stockNum === 0) {
          this.$message.error('当前药品库存为0');
          this.$refs[`groupList.${groupIndex}.${index}.medId`][0].visible = true;
        }else {
          const { presIndex, form } = this;
          const presList = form.presList;
          const groupItem = presList[presIndex].groupList[groupIndex];
          for(let i=0; i< groupItem.length; i++) {
            if(groupItem[i].medName === e.medName) {
              this.$message.error('该药品已经存在');
              this.$refs[`groupList.${groupIndex}.${index}.medId`][0].visible = true;
              return;
            }
          }
          this.keyArr.forEach(ev => {
            this.$set(presList[presIndex]['groupList'][groupIndex][index], ev, e[ev])
          })
          const formDom = this.$refs['my-form']
          formDom.validateField(`groupList.${groupIndex}.${index}.useRatio`);
          formDom.validateField(`groupList.${groupIndex}.${index}.doseRatio`);
          formDom.validateField(`groupList.${groupIndex}.${index}.presRatio`)
        }
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
    presAddClick() {
      const presList = this.form.presList;
      presList.push({ name: '普通院内处方', groupList: cloneObj(presItemCopy)});
      this.presIndex = presList.length - 1;
      this.reset()
    },
    // 处方删除
    presDelClick(index) {
      const presList = this.form.presList;
      if(index <= this.presIndex) {
        this.presIndex = presList.length - 2;
      }
      presList.splice(index, 1);
      this.delAllJudge();
    },
    // 处方下标点击
    presIndexClick(index) {
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
    delAllJudge() {
      const {itemActive, presIndex, form} = this;
      const presList = form.presList;
      if(presList.length === 0) {
        setTimeout(() => {
          this.presAddClick();
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
            this.groupDelClick();
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
      const groupItem = presList[presIndex].groupList[itemActive.groupIndex];
      groupItem.push({ groupIndex: itemActive.groupIndex });
      const activeKey = `groupList.${itemActive.groupIndex}.${groupItem.length-1}.medId`;
      this.rowColName = activeKey;
      // 拉开选择药品下拉框
      this.$nextTick(() => {
        event.stopPropagation();
        this.$refs[activeKey][0].visible = true;
      })
    },
    // 删除行
    lineDelClick() {
      const { itemActive, presIndex, form } = this;
      const presList = form.presList;
      presList[presIndex].groupList[itemActive.groupIndex].splice(itemActive.itemIndex, 1);
      this.delAllJudge();
    },
    // 新增组
    groupAddClick() {
      const { activeNames, presIndex, form } = this;
      const presList = form.presList;
      const groupList = presList[presIndex].groupList;
      const groupIndex = groupList.length;
      groupList.push([{ groupIndex }]);
      // 添加折叠面板
      activeNames.push(groupIndex)
    },
    // 删除组
    groupDelClick() {
      const { itemActive, presIndex, form } = this;
      const presList = form.presList;
      const groupList = presList[presIndex].groupList;
      groupList.splice(itemActive.groupIndex, 1);
      this.delAllJudge();
    }
  }
}
