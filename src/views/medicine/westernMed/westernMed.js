import { drugList } from "@/views/medicine/westernMed/data";
import CatTableSelect from "@/components/TableSelect/CatTableSelect";
import {cloneObj, isArray} from "@/utils/typePub";

const presItemCopy = [
  [
    { groupIndex: 0 }
  ]
];
const itemActiveCopy = { groupIndex: 0, itemIndex: 0 };
const groupItemCopy = [
  { groupIndex: 0 }
];
export default {
  name: "westernMed",
  components: {
    CatTableSelect
  },
  data() {
    return {
      presList: [{ name: '普通院内处方' }], // 处方列表
      presIndex: 0,
      activeNames: [0],
      groupList: {
        0: cloneObj(presItemCopy) // 属性名是处方下表，属性值是具体某个处方的内容
      },
      itemActive: cloneObj(itemActiveCopy),
      form: {
        dataList: [
          {  }
        ]
      },
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
        { code: 'qd', name: '一日一次' },
        { code: 'bid', name: '一日二次' },
        { code: 'tid', name: '一日三次' },
        { code: 'qid', name: '一日四次' },
        { code: 'qm', name: '早上一次' }
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
      const rowColName = `${column.property}${row.groupIndex}${row.index}`;
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
      this.rowColName = `${column.property}${row.groupIndex}${row.index}`;
      event.stopPropagation();
    },
    // 点击保存
    saveClick() {
      this.$refs['my-form'].validateWithInfo().then(res => {
        const formDom = document.getElementById('my-form');
        const errors = formDom.querySelector('.invalid');
        const input = errors.querySelector('input[type=text]');
        console.log(input)
        input.focus()
        // console.log(formDom)
        // const errors = formDom.querySelector('.invalid');
        // console.log(errors)
      })
      // console.log(this.$refs['my-form'])
      // this.$refs['my-form'].reset();
    },
    boxClick(e) {
      this.rowColName = ''
    },
    // 表格列表切换
    tableRowChange(e, groupIndex, index) {
      if(e) {
        const { groupList, presIndex } = this;
        this.keyArr.forEach(ev => {
          this.$set(groupList[presIndex][groupIndex][index], ev, e[ev])
          // groupList[presIndex][groupIndex][index][ev] = e[ev]
        })
        // console.log(this.$refs['my-form'].validateWithInfo())
        // setTimeout(() => {
        //   this.$refs['my-form'].validateWithInfo()
        // })
        // this.$set(groupList[presIndex][groupIndex][index], 'dose', e.doseRatio)
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
      this.$refs['my-form'].reset();
    },
    // 处方添加
    presAddClick() {
      this.presList.push({ name: '普通院内处方'});
      this.presIndex = this.presList.length - 1;
      this.groupList[this.presIndex] = cloneObj(presItemCopy);
      this.reset()
    },
    // 处方删除
    presDelClick(index) {
      this.presList.splice(index, 1);
      delete this.groupList[index];
      // 当删除当前选中的值时
      if(this.presIndex === index) {
        this.presIndex = this.presList.length - 1
      }
    },
    // 处方下标点击
    presIndexClick(index) {
      this.presIndex = index;
      this.reset()
    },
    // 新增行
    lineAddClick() {
      const { itemActive, groupList, presIndex } = this;
      groupList[presIndex][itemActive.groupIndex].push({ groupIndex: itemActive.groupIndex })
    },
    // 删除行
    lineDelClick() {
      const { itemActive, groupList, presIndex } = this;
      groupList[presIndex][itemActive.groupIndex].splice(itemActive.itemIndex, 1)
    },
    // 新增组
    groupAddClick() {
      const { groupList, activeNames, presIndex } = this;
      const groupIndex = groupList[presIndex].length;
      groupList[presIndex].push([{ groupIndex }]);
      // 添加折叠面板
      activeNames.push(groupList[presIndex].length - 1)
    },
    // 删除组
    groupDelClick() {
      const { itemActive, groupList, activeNames, presIndex } = this;
      groupList[presIndex].splice(itemActive.groupIndex, 1);
      // 删除折叠面板
      activeNames.forEach((ev, index) => {
        if(ev === itemActive.groupIndex) {
          activeNames.splice(index, 1)
        }
      })
    }
  }
}
