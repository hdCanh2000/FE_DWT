/* eslint-disable react/prop-types */
import {Table} from "antd";
import React, {useEffect, useState, memo, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
import moment from 'moment';
import _ from 'lodash';
import {L10n} from '@syncfusion/ej2-base';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import Card, {
  CardActions,
  CardBody,
  CardHeader,
  CardLabel,
  CardTitle,
} from '../../../components/bootstrap/Card';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import {fetchKpiNormList} from '../../../redux/slice/kpiNormSlice';
import OrderTaskForm from './OrdertaskForm';
import {deleteWorkTrack} from '../../dailyWorkTracking/services';
import verifyPermissionHOC from '../../../HOC/verifyPermissionHOC';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Button from '../../../components/bootstrap/Button';
import Loading from '../../../components/Loading/Loading';
import {toggleFormSlice} from '../../../redux/common/toggleFormSlice';
import AlertConfirm from '../../common/ComponentCommon/AlertConfirm';
import {fetchAssignTask} from '../../../redux/slice/worktrackSlice';


L10n.load({
  'vi-VI': {
    grid: {
      EmptyDataSourceError: 'Có lỗi xảy ra, vui lòng tải lại trang.',
      EmptyRecord: 'Không có dữ liệu nhiệm vụ.',
    },
  },
});

const createDataTree = (dataset) => {

  const hashTable = Object.create(null);
  dataset.forEach((aData) => {
    hashTable[aData.id] = {data: aData, children: []};
  });
  const dataTree = [];
  dataset.forEach((aData) => {
    if (aData.parentId) {
      hashTable[aData.parentId]?.children.push(hashTable[aData.id]);
    } else {
      dataTree.push(hashTable[aData.id]);
    }
  });
  return dataTree;
};

const Item = memo(({data, onOpen}) => {
  const dispatch = useDispatch();
  const {quantity, deadline, users} = data;
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const userResponsible = _.get(
    _.filter(users, (user) => {
      return _.get(user, 'workTrackUsers.isResponsible') === true;
    })[0],
    'name',
  );
  const handlDeleteItem = async (ele) => {
    try {
      await deleteWorkTrack(ele.id);
      toast.success('Xoá công việc thành công!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      dispatch(fetchAssignTask());
    } catch (error) {
      toast.error('Xoá công việc không thành công!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      throw error;
    }
  };
  return (
    <>
      <Card>
        <CardHeader className='pb-1 cursor-pointer w-100'>
          <CardLabel className='w-100 cursor-pointer' onClick={() => onOpen(data)}>
            <CardTitle>
              <CardLabel>
                {_.get(data, 'name')
                  ? _.get(data, 'name')
                  : _.get(data, 'kpiNorm.name')}
              </CardLabel>
            </CardTitle>
          </CardLabel>
          <CardActions onClick={handleOpen}>
            <FormGroup>
              <OverlayTrigger
                overlay={
                  <Tooltip id='addSubMission'>Xóa nhiệm vụ đã giao</Tooltip>
                }>
                <Button
                  type='button'
                  size='lg'
                  className='d-block w-10'
                  icon='Close'
                />
              </OverlayTrigger>
            </FormGroup>
          </CardActions>
        </CardHeader>
        <CardBody
          className='row px-4 pb-4 pt-1 cursor-pointer'
          onClick={() => onOpen(data)}>
          {verifyPermissionHOC(
            <div className='col-12'>Người phụ trách: {userResponsible}</div>,
            ['admin', 'manager'],
          )}
          <div className='col-12'>
            Thời hạn hoàn thành: {moment(deadline).format('DD-MM-YYYY')}
          </div>
          <div className='col-12'>Số lượng : {quantity}</div>
        </CardBody>
      </Card>
      <AlertConfirm
        openModal={open}
        onCloseModal={handleClose}
        onConfirm={() => handlDeleteItem(data)}
        title='Xoá công việc'
        content='Xác nhận xoá công việc đã giao?'
      />
    </>
  );
});

// const toolbarOptions = ['Search'];
// const searchOptions = {
//   fields: ['data.name', 'data.position.name'],
//   ignoreCase: true,
//   key: '',
//   operator: 'contains',
// };

const columns = [
  {
    title: 'Tên nhiệm vụ',
    dataIndex: 'name',
    key: 'name',
    width: '30%',
  },
  {
    title: 'Vị trí đảm nhiệm',
    dataIndex: 'position',
    key: 'position',
    width: '30%',
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    width: '10%',
    key: 'address',
  },
  {
    title: 'Giá trị KPI',
    dataIndex: 'kpi_value',
    width: '10%',
    key: 'kpiValue'
  }
];


const OrderTaskPage = () => {
  const dispatch = useDispatch();
  const kpiNorm = useSelector((state) => state.kpiNorm.kpiNorms);
  const tasks = useSelector((state) => state.worktrack.tasks);
  const loading = useSelector((state) => state.worktrack.loading);
  const toggleForm = useSelector((state) => state.toggleForm.open);
  const itemEdit = useSelector((state) => state.toggleForm.data);
  const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
  const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

  const [treeValue, setTreeValue] = useState([]);

  // norminalize data for antd table tree
  const antdTableData = useMemo(() => {
    return treeValue.map((item) => {
      if (item.children.length === 0) {
        return {
          ...item.data, position: item.data.position.name, key: item.data.id
        };
      }
      return {
        ...item.data, position: item.data.position.name, key: item.data.id, children: item.children.map((child) =>
          ({...child.data, position: child.data.position.name}))
      };
    })
  }, [treeValue]);

  useEffect(() => {
    dispatch(fetchAssignTask());
    dispatch(fetchKpiNormList());
  }, [dispatch]);

  useEffect(() => {
    if (!_.isEmpty(kpiNorm)) {
      const treeData = createDataTree(
        _.map(kpiNorm, (item) => {
          return {
            ...item,
            quantity: !_.isNumber(item.quantity) ? '--' : item.quantity,
            kpi_value: !_.isNumber(item.kpi_value) ? '--' : item.kpi_value,
            unit: item?.unit?.name,
          };
        }),
      );
      setTreeValue(treeData);
    }
  }, [kpiNorm]);

  const showKpiNorm = (kpiNormId) => {
    const newKpiNorm = kpiNorm.filter((item) => item.id === kpiNormId);
    return newKpiNorm.length !== 0 ? newKpiNorm[0].label : null;
  };

  return (
    <PageWrapper title='Giao việc'>
      <Page container='fluid'>
        {loading ? (
          <Loading/>
        ) : (
          <div>
            <div className='col-12'>
              <div className='row h-100 w-100'>
                <div className='col-4' style={{height: '800px'}}>
                  <Card style={{height: '800px'}}>
                    <CardHeader>
                      <CardLabel>
                        <CardTitle>
                          <CardLabel>Nhiệm vụ đã giao</CardLabel>
                        </CardTitle>
                      </CardLabel>
                      <CardActions style={{display: 'inline-flex'}}>
                        <Button
                          icon='ChangeCircle'
                          size='sm'
                          onClick={() => dispatch(fetchAssignTask())}
                          color='primary'>
                          Tải lại
                        </Button>
                      </CardActions>
                    </CardHeader>
                    <div className='p-4' style={{overflow: 'scroll'}}>
                      <div>
                        <div>
                          {tasks.length === 0 &&
                            'Chưa giao nhiệm vụ nào!'}
                        </div>
                        {tasks
                          // ?.filter((item) => item.parentId === null)
                          ?.map((item) => (
                            <Item
                              key={item.id}
                              showKpiNorm={showKpiNorm}
                              data={item}
                              onOpen={handleOpenForm}
                              dataChildren={2}
                            />
                          ))}
                      </div>
                    </div>
                  </Card>
                </div>
                <div className='col-8' style={{height: '800px'}}>
                  <Card style={{height: '800px'}}>
                    <CardHeader>
                      <CardLabel>
                        <CardTitle>
                          <CardLabel>Danh sách nhiệm vụ</CardLabel>
                        </CardTitle>
                      </CardLabel>
                    </CardHeader>
                    <CardBody className='mh-100' isScrollable>
                      <div className='control-pane h-100'>
                        <div className='control-section h-100'>
                          <Table
                            columns={columns}
                            dataSource={antdTableData}
                            pagination={{
                              defaultPageSize: 10,
                              position: ['bottomCenter'],
                              showSizeChanger: false,
                            }}
                            onRow={(record) => ({
                              onClick: () => {
                                handleOpenForm({
                                  children: record?.children || [],
                                  kpiNorm_id: record.id,
                                  unit: record.unit,
                                  quantity: record.quantity,
                                  kpi_value: record.kpi_value,
                                  kpiNorm_name: record.name,
                                });
                              },
                            })}
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}
      </Page>
      <OrderTaskForm show={toggleForm} onClose={handleCloseForm} item={itemEdit}/>
    </PageWrapper>
  );
};
export default OrderTaskPage;
